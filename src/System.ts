import { Environment, Movement } from "./typings/Enums";
import { SystemConfig } from "./typings/Config";
import { ConfigurationError } from "./typings/Error";
import { CollisionManager } from "./typings/Interfaces";

import SpatialHashGrid from "./collision/SpatialHashGrid";

import CollisionResolver from "./collision/CollisionResolver";
import Camera from "./utils/Camera";
import Renderer from "./utils/Renderer";

import Entity from "./entities/Entity";

import EventEmitter from "./EventEmitter";
import Vector from "./utils/Vector";

/** The area upon which the engine is operating on. */
export default class System extends EventEmitter {
    /** The camera viewing the system. */
    public camera: Camera;
    /** The renderer rendering the system. */
    public renderer: Renderer;

    /** The width of the system. */
    public width: number | null = null;
    /** The height of the system. */
    public height: number | null = null;

    /** The friction in the system. */
    public friction = 0.1;
    /** The gravity in the system. */
    public gravity = 0;

    /** The engine which partitions the system and efficiently checks for collisions. */
    public CollisionManager: CollisionManager;
    /** The engine which detects and resolves collisions. */
    public CollisionResolver = new CollisionResolver();

    /** The entities in the system. */
    public entities: (Entity | undefined)[] = [];

    /** The configuration of the system. */
    public config: SystemConfig;

    /** Flag for logging messages to console. */
    public verbose = false;

    /** The amount of ticks elapsed since the start of the engine. */
    public tick = 0;
    /** The amount of tick cycles that occur in one second. */
    public tickRate = 0;

    /** The environment the system is running in. */
    public environment = Environment.Browser;
    /** The performance of the system. */
    public performance = {
        /** The time it takes for a world update. */
        worldUpdateRate: 0,
        /** The amount of memory used, in bytes. */
        memoryUsage: 0
    };

    /** Gets the momentum of the system. */
    public get momentum() {
        let momentum = 0;
        
        for (const entity of this.entities) {
            if (!entity) continue;            
            momentum += (entity.velocity.magnitude * entity.mass) + Math.abs(entity.angularVelocity * entity.inertia) * entity.mass;
        }

        return momentum;
    }

    /** Gets the kinetic energy of the system. */
    public get kineticEnergy() {
        let energy = 0;
        for (const entity of this.entities) {
            if (!entity) continue;
            energy += 0.5 * entity.mass * (entity.velocity.magnitude * entity.velocity.magnitude);
        }

        return energy;
    }

    /** Gets the next available ID. */
    private get nextId(): number {
        const idx = this.entities.indexOf(undefined);
        if (idx !== -1) return idx;
        return this.entities.length;
    }

    constructor(config: SystemConfig) {
        super();

        this.environment = typeof window === "undefined" ? Environment.Node : Environment.Browser;
        this.config = config;

        this.width = config.dimensions?.x || null;
        this.height = config.dimensions?.y || null;

        if (
            (this.width && !this.height) ||
            (this.height && !this.width)
        ) throw new ConfigurationError("Both dimensions must be specified for the system.");

        this.friction = config.friction === undefined ? 0.1 : config.friction;
        this.gravity = config.gravity === undefined ? 0 : config.gravity;
        
        this.camera = new Camera(config.camera || {}, this);
        this.renderer = new Renderer(config.render, this);
        this.verbose = config.verbose || false;

        if (!config.collisionInfo) throw new ConfigurationError("Collision information must be specified for the system.");

        this.CollisionManager = new SpatialHashGrid(this, config.collisionInfo.cellSize || 12);

        if (this.verbose) console.log("[PHYSICS]: Engine started.");

        /** Handle ticksystem. */
        if (this.environment === Environment.Browser && config.useRAF !== false) {
            requestAnimationFrame(this.update.bind(this));
            return;
        }
        
        this.tickRate = config.tickRate || 60;
        setInterval(this.update.bind(this), 1000 / this.tickRate);
        // if (config.useRAF) requestAnimationFrame(this.update.bind(this));
        // else {
        //     this.tickRate = config.tickRate || 60;
        //     setInterval(this.update.bind(this), 1000 / this.tickRate);
        // }

    };

    /** Sets the collision engine. */
    public setCollisionEngine(engine: CollisionManager) {
        this.CollisionManager = engine;
    };

    private update() {        
        const time = performance.now();

        this.CollisionManager.clear();
        for (const entity of this.entities) {
            if (!entity) return;

            this.CollisionManager.insert(entity.bounds.min.x, entity.bounds.min.y, entity.hitbox.x, entity.hitbox.y, entity.id);
            entity.update();
        };
        this.CollisionManager.query();
        
        this.tick++;
        
        this.performance.worldUpdateRate = performance.now() - time;
        this.performance.memoryUsage = this.environment === Environment.Browser ?
            /** @ts-ignore */
            performance.memory?.usedJSHeapSize / 1024 / 1024 :
            process.memoryUsage().heapUsed / 1024 / 1024;

        if (this.environment === Environment.Browser && this.config.useRAF !== false)
            requestAnimationFrame(this.update.bind(this));
    };

    /** Adds an entity to the system. */
    public addEntity(entity: Entity) {
        const id = this.nextId;

        entity.id = id;
        this.entities[id] = entity;
        this.emit("entityCreate", entity);

        return entity;
    };

    /** Removes an entity from the system. */
    public removeEntity(entity: Entity) {
        this.entities[entity.id] = undefined;
        this.emit("entityDelete", entity);

        return entity;
    };
};