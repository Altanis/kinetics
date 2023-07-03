import System from "../System";
import { CircleConfig, EntityConfig } from "../typings/Interfaces";
import { Colors, EntityType, Movement } from "../typings/Enums";
import { ConfigurationError } from "../typings/Error";
import { EntityRenderingConfig } from "../typings/Config";

import Vector, { VectorLike } from "../utils/Vector";
  
/** A representation of a geometric entity. */
export default class Entity {
    /** The raw information of the entity. */
    protected info: EntityConfig | CircleConfig;
    /** The geometric type of the entity. */
    public type: EntityType = EntityType.Polygon;

    /** The vertices of the entity. */
    public vertices: Vector[];
    /** The coordinates of the entity. */
    public position!: Vector;
    /** The velocity of the entity. */
    public velocity = new Vector(0, 0);
    /** The acceleration of the entity. */
    public acceleration = new Vector(0, 0);
    /** The amount an entity can accelerate in a horizontal or vertical direction. */
    public speed: number;
    /** The mass of the entity. */
    public mass: number;
    /** The elasticity of the entity. */
    public elasticity: number;
    /** If the entity is static. */
    public static: boolean;
    /** The angular velocity of the entity. */
    public angularVelocity = 0;
    /** The angular speed of the entity. */
    public angularSpeed = 0;

    /** The collision hooks of the entity. */
    public hooks: { 
        /** The hooks to run before resolving collisions. */
        preResolve?: (entity: Entity) => void;
        /** The hooks to run after resolving collisions. */
        postResolve?: (entity: Entity) => void;
    } = {};

    /** The hitbox of the entity. */
    public get hitbox() { return this.bounds.dimensions; };

    /** The moment of inertia of the entity. */
    public get inertia() {
        if (this.static) return 0;

        const vertices = this.vertices;
        let inertia = 0;

        for (let i = 0; i < vertices.length; i++) {
            const vertex1 = vertices[i];
            const vertex2 = vertices[(i + 1) % vertices.length];

            const term1 = vertex1.cross(vertex1) + vertex2.cross(vertex2);
            const term2 = vertex1.cross(vertex2);

            inertia += term1 + term2;
        };

        return Math.abs(inertia) / 12;
    };


    private _angle = 0;
    /** Gets the angle of the entity. */
    public get angle() { return this._angle; };
    /** Sets the angle of the entity. */
    public set angle(value: number) {
        if (value === this._angle || this.info.rotate === false) return;

        const angle = value - this._angle;
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);

        this._angle = value;

        for (let i = 0; i < this.vertices.length; i++) {
            const translatedX = this.vertices[i].x - this.position.x;
            const translatedY = this.vertices[i].y - this.position.y;
            
            const rotatedX = translatedX * cos - translatedY * sin;
            const rotatedY = translatedX * sin + translatedY * cos;
            
            this.vertices[i].x = rotatedX + this.position.x;
            this.vertices[i].y = rotatedY + this.position.y;            
        }

    };

    /** The unique identifier for the entity. */
    public id!: number;
    
    /** The system the entity is in. */
    public system: System;

    /** The bounds of the entity for the collision manager. */
    public get bounds() {
        let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;

        if (this.position === undefined) {
            for (const vertex of this.vertices) {
                minX = Math.min(minX, vertex.x);
                maxX = Math.max(maxX, vertex.x);
                minY = Math.min(minY, vertex.y);
                maxY = Math.max(maxY, vertex.y);
            };

            this.position = new Vector((minX + maxX) / 2, (minY + maxY) / 2);
        } else {
            for (let vertex of this.vertices) {    
                minX = Math.min(minX, vertex.x);
                maxX = Math.max(maxX, vertex.x);
                minY = Math.min(minY, vertex.y);
                maxY = Math.max(maxY, vertex.y);
            };
        };
        
        const dimensions = new Vector((maxX - minX), (maxY - minY));

        return {
            min: new Vector(minX, minY),
            max: new Vector(maxX, maxY),
            dimensions
        };
    };
    
    // TODO(Altanis): Angular and linear momentum.

    /** The area of the entity. */
    public get area() {
        let area = 0;

        for (let i = 0; i < this.vertices.length; i++)
            area += this.vertices[i].cross(this.vertices[(i + 1) % this.vertices.length]);
        
        return Math.abs(area / 2);
    };

    /** The rendering options for the entity. */
    public rendering!: EntityRenderingConfig;

    constructor(info: EntityConfig | CircleConfig, system: System) {
        this.info = info;
        this.vertices = this.initializeVertices(info);

        this.bounds; // Initialize the bounds.

        this.mass = Math.max(1, info.mass);
        this.speed = info.speed;
        this.angularSpeed = info.angularSpeed || 0;
        this.elasticity = Math.max(0, info.elasticity) || 0;
        this.static = !!info.static;

        if (!info.mass) console.warn("[SYSTEM]: Entity mass defaulted to 1 due to a zero quantity being provided.");
        
        this.configure(info.render || {});
        this.hooks = info.hooks || {};

        this.system = system;
    }

    /** Initializes the vertices of the entity. */
    private initializeVertices(info: EntityConfig | CircleConfig) {
        if (!info.form) throw new ConfigurationError("No form was provided for the entity.");
        if (!info.form.sides && !info.form.vertices) throw new ConfigurationError("No sides nor vertices were provided for the entity.");

        let returnedVertices: Vector[] = [];

        if (info.form.vertices) returnedVertices = info.form.vertices;
        else if (info.form.sides) {          
            const vertices: Vector[] = [];
            const radius = info.form.radius;

            if (!radius) throw new ConfigurationError("No radius was provided for the entity.");

            const angleStep = (Math.PI * 2) / info.form.sides;
            for (let i = 0; i < info.form.sides; i++) {
                const startAngle = angleStep * i + (info.form.rotation || 0);

                vertices.push(
                    Vector.toCartesian(radius, startAngle).add(info.form.offset || { x: 0, y: 0 })
                );
            };

            returnedVertices = vertices;  
        } 
                
        return returnedVertices;
    };

    /** Configures the entity's rendering properties. */
    public configure(info: EntityRenderingConfig) {
        this.rendering = {
            strokeColor: info.strokeColor,
            fillColor: info.fillColor,
            strokeWidth: info.strokeWidth || 1,
            glowIntensity: info.glowIntensity,
            glowColor: info.glowColor,
            hooks: info.hooks || {},
        };
    };

    /** Rotates the entity by its angular speed. */
    public rotate(...directions: Movement[]) {
        for (const movement of directions) {
            switch (movement) {
                case Movement.Up: this.angularVelocity += this.angularSpeed; break;
                case Movement.Down: this.angularVelocity -= this.angularSpeed; break;
                case Movement.Left: this.angularVelocity -= this.angularSpeed; break;
                case Movement.Right: this.angularVelocity += this.angularSpeed; break;
                default: console.error("[SYSTEM]: Invalid angular movement key."); break;
            }
        }
    }
    
    /** Moves the entity by its linear speed. */
    public move(...directions: Movement[]) {
        for (const movement of directions) {
            switch (movement) {
                case Movement.Up: this.acceleration.y += this.speed; break;
                case Movement.Down: this.acceleration.y -= this.speed; break;
                case Movement.Left: this.acceleration.x -= this.speed; break;
                case Movement.Right: this.acceleration.x += this.speed; break;
                default: console.error("[SYSTEM]: Invalid movement key."); break;
            }
        }

        this.acceleration.normalize().scale(this.speed);
        this.velocity.add(this.acceleration); // Apply acceleration.
    };

    /** Update the entity. */
    public update() {
        if (this.static) this.velocity.x = this.velocity.y = this.angularVelocity = 0;
    
        /** Apply gravity. */
        if (this.system.gravity && !this.static) {
            this.velocity.y -= this.system.gravity;
        }

        this.velocity.scale(1 - this.system.friction); // Apply friction.
        this.angularVelocity *= 1 - this.system.friction; // Apply friction.

        this.updatePosition(this.velocity); // Apply velocity.
        this.angle += this.angularVelocity / 100; // Apply angular velocity.

        this.acceleration.scale(0); // Reset acceleration.
        
        this.system.emit("entityUpdate", this);
    };

    /** Updates the position. */
    public updatePosition(vector: VectorLike) {
        if (this.static) return;

        const width = this.system.width;
        const height = this.system.height;
        
        if (width && height) {
            const halfWidth = width / 2;
            const halfHeight = height / 2;

            if (this.position.x + vector.x > halfWidth) vector.x = halfWidth - this.position.x;
            else if (this.position.x + vector.x < -halfWidth) vector.x = -halfWidth - this.position.x;
            if (this.position.y + vector.y > halfHeight) vector.y = halfHeight - this.position.y;
            else if (this.position.y + vector.y < -halfHeight) vector.y = -halfHeight - this.position.y;
        }

        this.position.add(vector);
        for (const vertex of this.vertices) vertex.add(vector);
    };

    /** Determines the stroke and fill color of the entity. */
    protected determineColors(): { stroke: Colors | string | undefined, fill: Colors | string | undefined } {
        let stroke: Colors | string | undefined = undefined;
        let fill: Colors | string | undefined = undefined;

        if (this.rendering.strokeColor) stroke = this.rendering.strokeColor;
        if (this.rendering.fillColor) fill = this.rendering.fillColor;

        if (!stroke && !fill) stroke = Colors.Black;

        return { stroke, fill };
    };

    /** Renders the entity. */
    public render(context: CanvasRenderingContext2D) {
        const { stroke, fill } = this.determineColors();

        if (this.rendering.glowIntensity) {
            context.shadowBlur = this.rendering.glowIntensity;
            context.shadowColor = (this.rendering.glowColor || stroke || fill)!;
        }

        context.beginPath();
        if (stroke) context.strokeStyle = stroke;
        if (fill) context.fillStyle = fill;
        context.lineWidth = this.rendering.strokeWidth || 1;

        for (const vertex of this.vertices) {
            context.lineTo(vertex.x, -vertex.y);
        };

        context.closePath();

        if (fill) context.fill();
        if (stroke) context.stroke();
    };
};