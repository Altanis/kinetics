import Entity from "../entities/Entity";
import Vector, { VectorLike } from "../utils/Vector";
import { EntityRenderingConfig } from "./Config";

/** Represents the methods required in a collision manager. */
export interface CollisionManager {
    /** Inserts an entity into the collision manager. */
    insert(x: number, y: number, w: number, h: number, id: number): void;
    /** Queries the entire system, and automatically detects/resolves collisions. */
    query(): void;
    /** Clears the collision manager. */
    clear(): void;
};

export interface EntityForm {
    // OPTION 1: Regular Polygon
    /** The number of sides of the entity. */
    sides?: number;
    /** The radius of the entity. */
    radius?: number;
    /** The rotation of the entity. */
    rotation?: number;
    /** The center offset of the entity. */
    offset?: VectorLike;

    // OPTION 2: Custom Polygon
    /** The vertices of the entity (or compounded entities) (in clockwise order). */
    vertices?: Vector[];
     // OPTION 3: Components
    /** The components of the entity. */
    components?: (EntityConfig | CircleConfig)[];
};

/** Represents the information for a generic Entity. */
export interface EntityConfig {
    /** The form of the entity. */
    form: EntityForm;
    
    /** The speed of the Entity. */
    speed: number;
    /** The mass of the Entity. */
    mass: number;
    /** The elasticity of the Entity. */
    elasticity: number;
    /** Whether or not the entity is static. Defaults to `false`. */
    static?: boolean;
    /** The angular speed of the entity. Defaults to `0`. */
    angularSpeed?: number;
    /** Whether or not the entity should be able to rotate. Defaults to `true`. */
    rotate?: boolean;
    /** The threshold for the linear and angular velocities to put the entity to sleep. */
    sleepThreshold?: number;

    /** Rendering options for the entity. */
    render?: EntityRenderingConfig;
    /** The hooks into collision resolution. */
    hooks?: {
        /** The hooks to run before resolving collisions. */
        preResolve?: (entity: Entity) => void;
        /** The hooks to run after resolving collisions. */
        postResolve?: (entity: Entity) => void;
    };
};

/** Represents the information for a circle. */
export interface CircleConfig extends EntityConfig {
    /** The radius of the circle. */
    radius: number;
};