import Entity from "../entities/Entity";
import Circle from "../entities/shapes/Circle";

import { EntityType } from "../typings/Enums";
import Vector from "../utils/Vector";

/** A class which performs narrowphase collision detection on entities. */
export default class CollisionResolver {
    /** Detects collisions between two entities. */
    public detect(entity1: Entity, entity2: Entity) {
        if (entity1.components.length && entity2.components.length) {
            for (const component1 of entity1.components) {
                for (const component2 of entity2.components) {
                    const detected = this.detectSimple(component1, component2);
                    if (detected) break;
                }
            }

            return;
        } else if (entity1.components.length || entity2.components.length) {
            const component = entity1.components.length ? entity1 : entity2;
            const notComponent = entity1.components.length ? entity2 : entity1;
            
            for (const subComponent of component.components) {
                const detected = this.detectSimple(subComponent, notComponent);
                if (detected) break;
            }
        } else this.detectSimple(entity1, entity2);
    }

    /** Detects collisions between two simple entities. */
    public detectSimple(entity1: Entity, entity2: Entity): boolean {
        if (entity1.type === EntityType.Circle && entity2.type === EntityType.Circle) return this.detectCircleCircle(entity1 as Circle, entity2 as Circle);
        if (entity1.type === EntityType.Circle || entity2.type === EntityType.Circle) {
            const circle = entity1.type === EntityType.Circle ? entity1 : entity2;
            const notCircle = entity1.type === EntityType.Circle ? entity2 : entity1;

            return this.detectCirclePolygon(circle as Circle, notCircle);
        };

        let overlap = Infinity;
        let smallestAxis!: Vector;

        const vertices1 = entity1.vertices;
        const vertices2 = entity2.vertices;

        const edges = vertices1.length + vertices2.length;

        for (let i = 0; i < edges; i++) {
            /** Calculate the orthogonal vector to each edge. */
            let normal!: Vector;

            if (i < vertices1.length) normal = vertices1[i].clone.subtract(vertices1[(i + 1) % vertices1.length]).orthogonal.normalize();
            else normal = vertices2[i - vertices1.length].clone.subtract(vertices2[(i + 1) % vertices2.length]).orthogonal.normalize();

            /** Ignore zero vectors. */
            if (normal.x === 0 && normal.y === 0) continue;

            /** Project each vertex onto the orthogonal vector. */
            const [minA, maxA] = CollisionResolver.project(normal, vertices1);
            const [minB, maxB] = CollisionResolver.project(normal, vertices2);

            /** Calculate the overlap between the projections. */
            const overlapN = Math.min(maxA, maxB) - Math.max(minA, minB);
            
            if (overlapN <= 0) return false;
            /** Determine the smallest overlap. */
            if (overlapN < overlap) {
                smallestAxis = normal;
                overlap = overlapN;
            }
        }

        if (smallestAxis) {
            this.resolve(
                entity1.parent || entity1,
                entity2.parent || entity2, 
                Math.max(entity1.elasticity, entity2.elasticity),
                overlap,
                smallestAxis
            );

            entity1.lastCollisionFrame = entity1.tick;
            entity2.lastCollisionFrame = entity2.tick;
            
            return true;
        } else return false;
    };

    /** Detects collisions between a circle and a polygon. */
    private detectCirclePolygon(circle: Circle, polygon: Entity) {
        const vertices = polygon.vertices;

        let overlap = Infinity;
        let smallestAxis!: Vector;

        for (let i = 0; i < vertices.length; i++) {
            const vertex1 = vertices[i];
            const vertex2 = vertices[(i + 1) % vertices.length];
            const axis = vertex2.clone.subtract(vertex1).orthogonal.normalize();

            if (axis.x === 0 && axis.y === 0) continue;

            const [min, max] = CollisionResolver.project(axis, vertices);
            const circleProjection = circle.position.dot(axis);
            const overlapN = Math.min(max, circleProjection + circle.radius) - Math.max(min, circleProjection - circle.radius);

            if (overlapN <= 0) return false;
            if (overlapN < overlap) {
                overlap = overlapN;
                smallestAxis = axis;
            }
        }

        if (smallestAxis) {
            this.resolve(
                circle.parent || circle,
                polygon.parent || polygon, 
                Math.max(circle.elasticity, polygon.elasticity), 
                overlap, 
                smallestAxis
            );

            circle.lastCollisionFrame = circle.tick;
            polygon.lastCollisionFrame = polygon.tick;

            return true;
        } else return false;
    };

    /** Detects collisions between two circles. */
    private detectCircleCircle(circle1: Circle, circle2: Circle) {
        const distance = circle1.position.distance(circle2.position);        
        const overlap = (circle1.radius + circle2.radius) - distance;
        const axis = circle1.position.clone.subtract(circle2.position).normalize();

        if (overlap <= 0) return false;
        if (axis) {
            this.resolve(
                circle1.parent || circle1,
                circle2.parent || circle2,
                Math.max(circle1.elasticity, circle2.elasticity), 
                overlap, 
                axis
            );

            circle1.lastCollisionFrame = circle1.tick;
            circle2.lastCollisionFrame = circle2.tick;

            return true;
        } else return false;
    };

    /** Projects the vertices onto the given axis. */
    private static project(axis: Vector, vertices: Vector[]): [number, number] {
        let min = Infinity;
        let max = -Infinity;
        
        for (const vertex of vertices) {
            const projection = vertex.dot(axis);
            min = Math.min(min, projection);
            max = Math.max(max, projection);
        }

        return [min, max];
    };

    /** Resolves the collision between two entities. */
    private resolve(entity1: Entity, entity2: Entity, elasticity: number, overlap: number, axis: Vector) {
        entity1.hooks.preResolve?.(entity2);
        entity2.hooks.preResolve?.(entity1);

        if (entity1.position.dot(axis) < entity2.position.dot(axis)) axis.scale(-1);
        
        const velocity1 = entity1.velocity;
        const velocity2 = entity2.velocity;
        const mass1 = entity1.mass;
        const mass2 = entity2.mass;

        const velocity = velocity1.clone.subtract(velocity2);
        const velocityProjection = velocity.dot(axis);
        
        const impulse = (-(1 + (elasticity)) * velocityProjection) / (1 / mass1 + 1 / mass2);
        const impulseVector = axis.clone.scale(impulse);

        /** Change the velocity by impulse and elasticity. */
        if (!entity1.static) entity1.velocity.add(impulseVector.clone.scale(1 / mass1));
        if (!entity2.static) entity2.velocity.subtract(impulseVector.clone.scale(1 / mass2));

        /** Change the angular velocity of the entities. */
        if (!entity1.static && !entity2.static) {
            entity1.angularVelocity -= (1 / entity1.inertia) * entity1.position.clone.subtract(entity2.position).cross(impulseVector);
            entity2.angularVelocity -= (1 / entity2.inertia) * entity1.position.clone.subtract(entity2.position).cross(impulseVector);
        }
        
        /** Move the entities out of each other. */
        const penetration = axis.clone.scale(overlap / (1 / mass1 + 1 / mass2));
        if (!entity1.static) entity1.updatePosition(penetration.clone.scale(1 / mass1));
        if (!entity2.static) entity2.updatePosition(penetration.clone.scale(-1 / mass2));

        entity1.hooks.postResolve?.(entity2);
        entity2.hooks.postResolve?.(entity1);
    };
};