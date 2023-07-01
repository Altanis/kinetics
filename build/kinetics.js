/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 660:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
/** Polyfill for an event emitter. */
class EventEmitter {
    constructor() {
        this.events = {};
    }
    /** Adds a listener for an event. */
    on(event, listener) {
        if (!this.events[event])
            this.events[event] = [];
        this.events[event].push(listener);
    }
    /** Emits an event. */
    emit(event, ...args) {
        if (!this.events[event])
            return;
        for (const listener of this.events[event]) {
            listener(...args);
        }
    }
}
exports["default"] = EventEmitter;
;


/***/ }),

/***/ 296:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Colors = exports.EntityType = exports.Environment = exports.Movement = exports.Vector = exports.Renderer = exports.Camera = exports.Collision = exports.Circle = exports.Entity = exports.System = void 0;
const System_1 = __importDefault(__webpack_require__(510));
exports.System = System_1.default;
const CollisionResolver_1 = __importDefault(__webpack_require__(845));
const SpatialHashGrid_1 = __importDefault(__webpack_require__(404));
const Entity_1 = __importDefault(__webpack_require__(694));
exports.Entity = Entity_1.default;
const Circle_1 = __importDefault(__webpack_require__(149));
exports.Circle = Circle_1.default;
const Camera_1 = __importDefault(__webpack_require__(940));
exports.Camera = Camera_1.default;
const Renderer_1 = __importDefault(__webpack_require__(544));
exports.Renderer = Renderer_1.default;
const Vector_1 = __importDefault(__webpack_require__(91));
exports.Vector = Vector_1.default;
const Enums_1 = __webpack_require__(184);
Object.defineProperty(exports, "Movement", ({ enumerable: true, get: function () { return Enums_1.Movement; } }));
Object.defineProperty(exports, "Environment", ({ enumerable: true, get: function () { return Enums_1.Environment; } }));
Object.defineProperty(exports, "EntityType", ({ enumerable: true, get: function () { return Enums_1.EntityType; } }));
Object.defineProperty(exports, "Colors", ({ enumerable: true, get: function () { return Enums_1.Colors; } }));
/** C O L L I S I O N */
exports.Collision = { CollisionResolver: CollisionResolver_1.default, SpatialHashGrid: SpatialHashGrid_1.default };


/***/ }),

/***/ 510:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const Enums_1 = __webpack_require__(184);
const Error_1 = __webpack_require__(2);
const SpatialHashGrid_1 = __importDefault(__webpack_require__(404));
const CollisionResolver_1 = __importDefault(__webpack_require__(845));
const Camera_1 = __importDefault(__webpack_require__(940));
const Renderer_1 = __importDefault(__webpack_require__(544));
const EventEmitter_1 = __importDefault(__webpack_require__(660));
/** The area upon which the engine is operating on. */
class System extends EventEmitter_1.default {
    /** Gets the momentum of the system. */
    get momentum() {
        let momentum = 0;
        for (const entity of this.entities) {
            if (!entity)
                continue;
            momentum += (entity.velocity.magnitude * entity.mass) + Math.abs(entity.angularVelocity * entity.inertia) * entity.mass;
        }
        return momentum;
    }
    /** Gets the kinetic energy of the system. */
    get kineticEnergy() {
        let energy = 0;
        for (const entity of this.entities) {
            if (!entity)
                continue;
            energy += 0.5 * entity.mass * (entity.velocity.magnitude * entity.velocity.magnitude);
        }
        return energy;
    }
    /** Gets the next available ID. */
    get nextId() {
        const idx = this.entities.indexOf(undefined);
        if (idx !== -1)
            return idx;
        return this.entities.length;
    }
    constructor(config) {
        var _a, _b;
        super();
        /** The width of the system. */
        this.width = null;
        /** The height of the system. */
        this.height = null;
        /** The friction in the system. */
        this.friction = 0.1;
        /** The gravity in the system. */
        this.gravity = 0;
        /** The engine which detects and resolves collisions. */
        this.CollisionResolver = new CollisionResolver_1.default();
        /** The entities in the system. */
        this.entities = [];
        /** Flag for logging messages to console. */
        this.verbose = false;
        /** The amount of ticks elapsed since the start of the engine. */
        this.tick = 0;
        /** The amount of tick cycles that occur in one second. */
        this.tickRate = 0;
        /** The environment the system is running in. */
        this.environment = Enums_1.Environment.Browser;
        /** The performance of the system. */
        this.performance = {
            /** The time it takes for a world update. */
            worldUpdateRate: 0,
            /** The amount of memory used, in bytes. */
            memoryUsage: 0
        };
        this.environment = typeof window === "undefined" ? Enums_1.Environment.Node : Enums_1.Environment.Browser;
        this.config = config;
        this.width = ((_a = config.dimensions) === null || _a === void 0 ? void 0 : _a.x) || null;
        this.height = ((_b = config.dimensions) === null || _b === void 0 ? void 0 : _b.y) || null;
        if ((this.width && !this.height) ||
            (this.height && !this.width))
            throw new Error_1.ConfigurationError("Both dimensions must be specified for the system.");
        this.friction = config.friction === undefined ? 0.1 : config.friction;
        this.gravity = config.gravity === undefined ? 0 : config.gravity;
        this.camera = new Camera_1.default(config.camera || {}, this);
        this.renderer = new Renderer_1.default(config.render, this);
        this.verbose = !!config.verbose;
        if (!config.collisionInfo)
            throw new Error_1.ConfigurationError("Collision information must be specified for the system.");
        this.CollisionManager = new SpatialHashGrid_1.default(this, config.collisionInfo.cellSize || 12);
        /** Handle ticksystem. */
        if (config.useRAF)
            requestAnimationFrame(this.update.bind(this));
        else {
            this.tickRate = config.tickRate || 60;
            setInterval(this.update.bind(this), 1000 / this.tickRate);
        }
        if (this.verbose)
            console.log("[PHYSICS]: Engine started.");
    }
    ;
    /** Sets the collision engine. */
    setCollisionEngine(engine) {
        this.CollisionManager = engine;
    }
    ;
    update() {
        var _a;
        const time = performance.now();
        this.CollisionManager.clear();
        for (const entity of this.entities) {
            if (!entity)
                return;
            this.CollisionManager.insert(entity.bounds.min.x, entity.bounds.min.y, entity.bounds.dimensions.x, entity.bounds.dimensions.y, entity.id);
            entity.update();
        }
        ;
        this.CollisionManager.query();
        this.tick++;
        this.performance.worldUpdateRate = performance.now() - time;
        this.performance.memoryUsage = this.environment === Enums_1.Environment.Browser ?
            /** @ts-ignore */
            ((_a = performance.memory) === null || _a === void 0 ? void 0 : _a.usedJSHeapSize) / 1024 / 1024 :
            process.memoryUsage().heapUsed / 1024 / 1024;
        if (this.config.useRAF)
            requestAnimationFrame(this.update.bind(this));
    }
    ;
    /** Adds an entity to the system. */
    addEntity(entity) {
        const id = this.nextId;
        entity.id = id;
        this.entities[id] = entity;
        this.emit("entityCreate", entity);
        return entity;
    }
    ;
    /** Removes an entity from the system. */
    removeEntity(entity) {
        this.entities[entity.id] = undefined;
        this.emit("entityDelete", entity);
        return entity;
    }
    ;
}
exports["default"] = System;
;


/***/ }),

/***/ 845:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const Enums_1 = __webpack_require__(184);
/** A class which performs narrowphase collision detection on entities. */
class CollisionResolver {
    /** Detects collisions between two entities. */
    detect(entity1, entity2) {
        if (entity1.type === Enums_1.EntityType.Circle && entity2.type === Enums_1.EntityType.Circle)
            return this.detectCircleCircle(entity1, entity2);
        if (entity1.type === Enums_1.EntityType.Circle || entity2.type === Enums_1.EntityType.Circle) {
            const circle = entity1.type === Enums_1.EntityType.Circle ? entity1 : entity2;
            const notCircle = entity1.type === Enums_1.EntityType.Circle ? entity2 : entity1;
            return this.detectCirclePolygon(circle, notCircle);
        }
        ;
        let overlap = Infinity;
        let smallestAxis;
        const vertices1 = entity1.vertices;
        const vertices2 = entity2.vertices;
        const edges = vertices1.length + vertices2.length;
        for (let i = 0; i < edges; i++) {
            /** Calculate the orthogonal vector to each edge. */
            let normal;
            if (i < vertices1.length)
                normal = vertices1[i].clone.subtract(vertices1[(i + 1) % vertices1.length]).orthogonal.normalize();
            else
                normal = vertices2[i - vertices1.length].clone.subtract(vertices2[(i + 1) % vertices2.length]).orthogonal.normalize();
            /** Ignore zero vectors. */
            if (normal.x === 0 && normal.y === 0)
                continue;
            /** Project each vertex onto the orthogonal vector. */
            const [minA, maxA] = CollisionResolver.project(normal, vertices1);
            const [minB, maxB] = CollisionResolver.project(normal, vertices2);
            /** Calculate the overlap between the projections. */
            const overlapN = Math.min(maxA, maxB) - Math.max(minA, minB);
            if (overlapN <= 0)
                return;
            /** Determine the smallest overlap. */
            if (overlapN < overlap) {
                smallestAxis = normal;
                overlap = overlapN;
            }
        }
        if (smallestAxis)
            this.resolve(entity1, entity2, Math.max(entity1.elasticity, entity2.elasticity), overlap, smallestAxis);
    }
    ;
    /** Detects collisions between a circle and a polygon. */
    detectCirclePolygon(circle, polygon) {
        const vertices = polygon.vertices;
        let overlap = Infinity;
        let smallestAxis;
        for (let i = 0; i < vertices.length; i++) {
            const vertex1 = vertices[i];
            const vertex2 = vertices[(i + 1) % vertices.length];
            const axis = vertex2.clone.subtract(vertex1).orthogonal.normalize();
            if (axis.x === 0 && axis.y === 0)
                continue;
            const [min, max] = CollisionResolver.project(axis, vertices);
            const circleProjection = circle.position.dot(axis);
            const overlapN = Math.min(max, circleProjection + circle.radius) - Math.max(min, circleProjection - circle.radius);
            if (overlapN <= 0)
                return;
            if (overlapN < overlap) {
                overlap = overlapN;
                smallestAxis = axis;
            }
        }
        if (smallestAxis)
            this.resolve(circle, polygon, Math.max(circle.elasticity, polygon.elasticity), overlap, smallestAxis);
    }
    ;
    /** Detects collisions between two circles. */
    detectCircleCircle(circle1, circle2) {
        const distance = circle1.position.distance(circle2.position);
        const overlap = (circle1.radius + circle2.radius) - distance;
        const axis = circle1.position.clone.subtract(circle2.position).normalize();
        if (overlap <= 0)
            return;
        if (axis)
            this.resolve(circle1, circle2, Math.max(circle1.elasticity, circle2.elasticity), overlap, axis);
    }
    ;
    /** Projects the vertices onto the given axis. */
    static project(axis, vertices) {
        let min = Infinity;
        let max = -Infinity;
        for (const vertex of vertices) {
            const projection = vertex.dot(axis);
            min = Math.min(min, projection);
            max = Math.max(max, projection);
        }
        return [min, max];
    }
    ;
    /** Resolves the collision between two entities. */
    resolve(entity1, entity2, elasticity, overlap, axis) {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        (_b = (_a = entity1.hooks).preResolve) === null || _b === void 0 ? void 0 : _b.call(_a, entity2);
        (_d = (_c = entity2.hooks).preResolve) === null || _d === void 0 ? void 0 : _d.call(_c, entity1);
        if (entity1.position.dot(axis) < entity2.position.dot(axis))
            axis.scale(-1);
        const velocity1 = entity1.velocity;
        const velocity2 = entity2.velocity;
        const mass1 = entity1.mass;
        const mass2 = entity2.mass;
        const velocity = velocity1.clone.subtract(velocity2);
        const velocityProjection = velocity.dot(axis);
        const impulse = (-(1 + (elasticity)) * velocityProjection) / (1 / mass1 + 1 / mass2);
        const impulseVector = axis.clone.scale(impulse);
        /** Change the velocity by impulse and elasticity. */
        if (!entity1.static)
            entity1.velocity.add(impulseVector.clone.scale(1 / mass1));
        if (!entity2.static)
            entity2.velocity.subtract(impulseVector.clone.scale(1 / mass2));
        /** Change the angular velocity of the entities. */
        if (!entity1.static && !entity2.static) {
            entity1.angularVelocity += (1 / entity1.inertia) * entity1.position.clone.subtract(entity2.position).cross(impulseVector);
            entity2.angularVelocity -= (1 / entity2.inertia) * entity1.position.clone.subtract(entity2.position).cross(impulseVector);
        }
        /** Move the entities out of each other. */
        const penetration = axis.clone.scale(overlap / (1 / mass1 + 1 / mass2));
        if (!entity1.static)
            entity1.updatePosition(penetration.clone.scale(1 / mass1));
        if (!entity2.static)
            entity2.updatePosition(penetration.clone.scale(-1 / mass2));
        (_f = (_e = entity1.hooks).postResolve) === null || _f === void 0 ? void 0 : _f.call(_e, entity2);
        (_h = (_g = entity2.hooks).postResolve) === null || _h === void 0 ? void 0 : _h.call(_g, entity1);
    }
    ;
}
exports["default"] = CollisionResolver;
;


/***/ }),

/***/ 404:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const Error_1 = __webpack_require__(2);
const hash = (x, y) => x + y * 0xB504;
/** A binary space partitioning system which splits the arena into square cells.  */
class SpatialHashGrid {
    constructor(system, cellSize) {
        this.cells = new Map();
        if (!Number.isInteger(cellSize) || cellSize >= 32)
            throw new Error_1.ConfigurationError("Could not initialize SpatialHashGrid: Cell size must be an integer value less than 32.");
        this.system = system;
        this.cellSize = cellSize;
    }
    /** Inserts an entity into the grid. */
    insert(x, y, w, h, id) {
        const startX = x >> this.cellSize;
        const startY = y >> this.cellSize;
        const endX = (x + w) >> this.cellSize;
        const endY = (y + h) >> this.cellSize;
        for (let x = startX; x <= endX; x++) {
            for (let y = startY; y <= endY; y++) {
                const key = hash(x, y);
                if (!this.cells.get(key))
                    this.cells.set(key, []);
                this.cells.get(key).push(id);
            }
        }
    }
    /* Queries the grid by iterating over every cell and performing narrowphase detection on each entity. */
    query() {
        // iterate over each map
        this.cells.forEach(cell => {
            const length = cell.length;
            if (length < 2)
                return;
            for (let i = 0; i < length; i++) {
                for (let j = i + 1; j < length; j++) {
                    /** @ts-ignore */
                    const entity1 = this.system.entities[cell[i]];
                    /** @ts-ignore */
                    const entity2 = this.system.entities[cell[j]];
                    this.system.CollisionResolver.detect(entity1, entity2);
                }
            }
        });
        // for (const key in this.cells) {
        //     const cell = this.cells.get(key);
        //     const length = cell.length;
        //     if (length < 2) continue;
        //     for (let j = 0; j < length; j++) {
        //         for (let k = j + 1; k < length; k++) {
        //             const entity1 = this.system.entities[cell[j]]!;
        //             const entity2 = this.system.entities[cell[k]]!;
        //             this.system.CollisionResolver.detect(entity1, entity2);
        //         }
        //     }
        // }
    }
    /** Clears the grid. */
    clear() {
        this.cells.clear();
    }
    ;
}
exports["default"] = SpatialHashGrid;
;


/***/ }),

/***/ 694:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const Enums_1 = __webpack_require__(184);
const Error_1 = __webpack_require__(2);
const Vector_1 = __importDefault(__webpack_require__(91));
/** A representation of a geometric entity. */
class Entity {
    /** The hitbox of the entity. */
    get hitbox() { return this.bounds.dimensions; }
    ;
    /** The moment of inertia of the entity. */
    get inertia() {
        if (this.static)
            return 0;
        const vertices = this.vertices;
        let inertia = 0;
        for (let i = 0; i < vertices.length; i++) {
            const vertex1 = vertices[i];
            const vertex2 = vertices[(i + 1) % vertices.length];
            const term1 = vertex1.cross(vertex1) + vertex2.cross(vertex2);
            const term2 = vertex1.cross(vertex2);
            inertia += term1 + term2;
        }
        ;
        return Math.abs(inertia) / 12;
    }
    ;
    /** Gets the angle of the entity. */
    get angle() { return this._angle; }
    ;
    /** Sets the angle of the entity. */
    set angle(value) {
        if (value === this._angle || this.info.rotate === false)
            return;
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
    }
    ;
    /** The bounds of the entity for the collision manager. */
    get bounds() {
        let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
        if (this.position === undefined) {
            for (const vertex of this.vertices) {
                minX = Math.min(minX, vertex.x);
                maxX = Math.max(maxX, vertex.x);
                minY = Math.min(minY, vertex.y);
                maxY = Math.max(maxY, vertex.y);
            }
            ;
            this.position = new Vector_1.default((minX + maxX) / 2, (minY + maxY) / 2);
        }
        else {
            for (let vertex of this.vertices) {
                minX = Math.min(minX, vertex.x);
                maxX = Math.max(maxX, vertex.x);
                minY = Math.min(minY, vertex.y);
                maxY = Math.max(maxY, vertex.y);
            }
            ;
        }
        ;
        const dimensions = new Vector_1.default((maxX - minX), (maxY - minY));
        return {
            min: new Vector_1.default(minX, minY),
            max: new Vector_1.default(maxX, maxY),
            dimensions
        };
    }
    ;
    // TODO(Altanis): Angular and linear momentum.
    /** The area of the entity. */
    get area() {
        let area = 0;
        for (let i = 0; i < this.vertices.length; i++)
            area += this.vertices[i].cross(this.vertices[(i + 1) % this.vertices.length]);
        return Math.abs(area / 2);
    }
    ;
    constructor(info, system) {
        /** The geometric type of the entity. */
        this.type = Enums_1.EntityType.Polygon;
        /** The velocity of the entity. */
        this.velocity = new Vector_1.default(0, 0);
        /** The acceleration of the entity. */
        this.acceleration = new Vector_1.default(0, 0);
        /** The angular velocity of the entity. */
        this.angularVelocity = 0;
        /** The angular speed of the entity. */
        this.angularSpeed = 0;
        /** The collision hooks of the entity. */
        this.hooks = {};
        this._angle = 0;
        this.info = info;
        this.vertices = this.initializeVertices(info);
        this.bounds; // Initialize the bounds.
        this.mass = Math.max(1, info.mass);
        this.speed = info.speed;
        this.angularSpeed = info.angularSpeed || 0;
        this.elasticity = Math.max(0, info.elasticity) || 0;
        this.static = !!info.static;
        if (!info.mass)
            console.warn("[SYSTEM]: Entity mass defaulted to 1 due to a zero quantity being provided.");
        this.configure(info.render || {});
        this.hooks = info.hooks || {};
        this.system = system;
    }
    /** Initializes the vertices of the entity. */
    initializeVertices(info) {
        if (!info.form)
            throw new Error_1.ConfigurationError("No form was provided for the entity.");
        if (!info.form.sides && !info.form.vertices)
            throw new Error_1.ConfigurationError("No sides nor vertices were provided for the entity.");
        let returnedVertices = [];
        if (info.form.vertices)
            returnedVertices = info.form.vertices;
        else if (info.form.sides) {
            const vertices = [];
            const radius = info.form.radius;
            if (!radius)
                throw new Error_1.ConfigurationError("No radius was provided for the entity.");
            const angleStep = (Math.PI * 2) / info.form.sides;
            for (let i = 0; i < info.form.sides; i++) {
                const startAngle = angleStep * i + (info.form.rotation || 0);
                vertices.push(Vector_1.default.toCartesian(radius, startAngle).add(info.form.offset || { x: 0, y: 0 }));
            }
            ;
            returnedVertices = vertices;
        }
        return returnedVertices;
    }
    ;
    /** Configures the entity's rendering properties. */
    configure(info) {
        this.rendering = {
            strokeColor: info.strokeColor,
            fillColor: info.fillColor,
            strokeWidth: info.strokeWidth || 1,
            glowIntensity: info.glowIntensity,
            glowColor: info.glowColor,
            hooks: info.hooks || {},
        };
    }
    ;
    /** Rotates the entity by its angular speed. */
    rotate(...directions) {
        for (const movement of directions) {
            switch (movement) {
                case Enums_1.Movement.Up:
                    this.angularVelocity += this.angularSpeed;
                    break;
                case Enums_1.Movement.Down:
                    this.angularVelocity -= this.angularSpeed;
                    break;
                case Enums_1.Movement.Left:
                    this.angularVelocity -= this.angularSpeed;
                    break;
                case Enums_1.Movement.Right:
                    this.angularVelocity += this.angularSpeed;
                    break;
                default:
                    console.error("[SYSTEM]: Invalid angular movement key.");
                    break;
            }
        }
    }
    /** Moves the entity by its linear speed. */
    move(...directions) {
        for (const movement of directions) {
            switch (movement) {
                case Enums_1.Movement.Up:
                    this.acceleration.y += this.speed;
                    break;
                case Enums_1.Movement.Down:
                    this.acceleration.y -= this.speed;
                    break;
                case Enums_1.Movement.Left:
                    this.acceleration.x -= this.speed;
                    break;
                case Enums_1.Movement.Right:
                    this.acceleration.x += this.speed;
                    break;
                default:
                    console.error("[SYSTEM]: Invalid movement key.");
                    break;
            }
        }
        this.acceleration.normalize().scale(this.speed);
        this.velocity.add(this.acceleration); // Apply acceleration.
    }
    ;
    /** Update the entity. */
    update() {
        if (this.static)
            this.velocity.x = this.velocity.y = this.angularVelocity = 0;
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
    }
    ;
    /** Updates the position. */
    updatePosition(vector) {
        if (this.static)
            return;
        const width = this.system.width;
        const height = this.system.height;
        if (width && height) {
            const halfWidth = width / 2;
            const halfHeight = height / 2;
            if (this.position.x + vector.x > halfWidth)
                vector.x = halfWidth - this.position.x;
            else if (this.position.x + vector.x < -halfWidth)
                vector.x = -halfWidth - this.position.x;
            if (this.position.y + vector.y > halfHeight)
                vector.y = halfHeight - this.position.y;
            else if (this.position.y + vector.y < -halfHeight)
                vector.y = -halfHeight - this.position.y;
        }
        this.position.add(vector);
        for (const vertex of this.vertices)
            vertex.add(vector);
    }
    ;
    /** Determines the stroke and fill color of the entity. */
    determineColors() {
        let stroke = undefined;
        let fill = undefined;
        if (this.rendering.strokeColor)
            stroke = this.rendering.strokeColor;
        if (this.rendering.fillColor)
            fill = this.rendering.fillColor;
        if (!stroke && !fill)
            stroke = Enums_1.Colors.Black;
        return { stroke, fill };
    }
    ;
    /** Renders the entity. */
    render(context) {
        const { stroke, fill } = this.determineColors();
        if (this.rendering.glowIntensity) {
            context.shadowBlur = this.rendering.glowIntensity;
            context.shadowColor = (this.rendering.glowColor || stroke || fill);
        }
        context.beginPath();
        if (stroke)
            context.strokeStyle = stroke;
        if (fill)
            context.fillStyle = fill;
        context.lineWidth = this.rendering.strokeWidth || 1;
        for (const vertex of this.vertices) {
            context.lineTo(vertex.x, -vertex.y);
        }
        ;
        context.closePath();
        if (fill)
            context.fill();
        if (stroke)
            context.stroke();
    }
    ;
}
exports["default"] = Entity;
;


/***/ }),

/***/ 149:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const Entity_1 = __importDefault(__webpack_require__(694));
const Enums_1 = __webpack_require__(184);
const Error_1 = __webpack_require__(2);
const Vector_1 = __importDefault(__webpack_require__(91));
/** A specific geometric entity which represents a circle. */
class Circle extends Entity_1.default {
    /** The bounds of the entity for the collision manager. */
    get bounds() {
        const vertex = this.position || this.vertices[0];
        if (this.position === undefined)
            this.position = vertex;
        return {
            min: new Vector_1.default(vertex.x - this.radius, vertex.y - this.radius),
            max: vertex,
            dimensions: this.hitbox
        };
    }
    ;
    /** The radius of the circle. */
    get radius() { return this._radius; }
    ;
    set radius(value) {
        if (value <= 0)
            throw new Error_1.ConfigurationError("The radius of a circle must be greater than 0.");
        this._radius = value;
    }
    ;
    /** The hitbox of the circle. */
    get hitbox() { return new Vector_1.default(this.radius * 2, this.radius * 2); }
    ;
    /** The moment of inertia of the circle. */
    get inertia() { return this.static ? 0 : (this.mass * this.radius * this.radius) / 2; }
    ;
    constructor(info, system) {
        super(info, system);
        this.type = Enums_1.EntityType.Circle;
        this._radius = 0;
        this.radius = info.radius;
    }
    ;
    /** Circles cannot rotate. Editing the angular velocity will deform the hitbox. */
    rotate() { }
    ;
    /** Renders the circle. */
    render(context) {
        const { stroke, fill } = this.determineColors();
        if (this.rendering.glowIntensity) {
            context.shadowBlur = this.rendering.glowIntensity;
            context.shadowColor = (this.rendering.glowColor || stroke || fill);
        }
        context.beginPath();
        if (fill)
            context.fillStyle = fill;
        if (stroke)
            context.strokeStyle = stroke;
        context.lineWidth = this.rendering.strokeWidth || 1;
        context.arc(this.position.x, -this.position.y, this.radius, 0, 2 * Math.PI);
        context.closePath();
        context.stroke();
        if (fill)
            context.fill();
        if (stroke)
            context.stroke();
    }
    ;
}
exports["default"] = Circle;
;


/***/ }),

/***/ 184:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Colors = exports.EntityType = exports.Environment = exports.Movement = void 0;
/** Enum representing movement. */
var Movement;
(function (Movement) {
    Movement[Movement["Up"] = 0] = "Up";
    Movement[Movement["Down"] = 1] = "Down";
    Movement[Movement["Left"] = 2] = "Left";
    Movement[Movement["Right"] = 3] = "Right";
})(Movement = exports.Movement || (exports.Movement = {}));
;
/** Enum representing the environment the program is running in. */
var Environment;
(function (Environment) {
    Environment[Environment["Browser"] = 0] = "Browser";
    Environment[Environment["Node"] = 1] = "Node";
    // Executable
})(Environment = exports.Environment || (exports.Environment = {}));
;
/** Enum representing the geometric type of the entity. */
var EntityType;
(function (EntityType) {
    EntityType[EntityType["Polygon"] = 0] = "Polygon";
    EntityType[EntityType["Circle"] = 1] = "Circle";
})(EntityType = exports.EntityType || (exports.EntityType = {}));
;
/** Enum representing different colors. */
var Colors;
(function (Colors) {
    Colors["Pink"] = "#F177DD";
    Colors["LightRed"] = "#FC7677";
    Colors["Red"] = "#F14E54";
    Colors["Yellow"] = "#FFE869";
    Colors["Peach"] = "#FCC376";
    Colors["Orange"] = "#FFA500";
    Colors["Green"] = "#00E16E";
    Colors["BrightGreen"] = "#43FF91";
    Colors["NeonGreen"] = "#8AFF69";
    Colors["Blue"] = "#00B2E1";
    Colors["DarkBlue"] = "#768DFC";
    Colors["Purple"] = "#BF7FF5";
    Colors["Gray"] = "#C0C0C0";
    Colors["Black"] = "#000000";
    Colors["White"] = "#FFFFFF";
})(Colors = exports.Colors || (exports.Colors = {}));
;


/***/ }),

/***/ 2:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ConfigurationError = exports.InternalError = void 0;
class InternalError extends Error {
    constructor(message) {
        super("[SYSTEM]: Whoops, something went wrong! Please report it at our GitHub page: " + message);
        this.name = "InternalError";
    }
}
exports.InternalError = InternalError;
;
class ConfigurationError extends Error {
    constructor(message) {
        super("[SYSTEM]: An error occurred when configuring an Entity or the System: " + message);
        this.name = "ConfigurationError";
    }
}
exports.ConfigurationError = ConfigurationError;
;


/***/ }),

/***/ 940:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const Vector_1 = __importDefault(__webpack_require__(91));
/** A representation of the view of the system. */
class Camera {
    /** Sets the camera's center position. */
    setCenter(position) {
        this.position.x = position.x;
        this.position.y = position.y;
    }
    ;
    constructor({ position, zoom }, system) {
        /** The position the camera is centered at. */
        this.position = new Vector_1.default(0, 0);
        /** The measure of how zoomed out the camera is. */
        this.zoom = 1;
        this.setCenter(position || { x: 0, y: 0 });
        this.zoom = (zoom || 1);
        this.system = system;
    }
    ;
}
exports["default"] = Camera;
;


/***/ }),

/***/ 544:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const Enums_1 = __webpack_require__(184);
const Error_1 = __webpack_require__(2);
/** The class which handles rendering of the system. */
class Renderer {
    constructor(config, system) {
        /** Data about framerates. */
        this.framerate = {
            /** The list of the last 30 framerates. */
            fpsArr: [],
            /** The average framerate. */
            fps: 0,
            /** The delta between frames. */
            dt: 0,
            /** The last time the framerate was updated. */
            lastUpdate: 0,
        };
        this.system = system;
        if (!config || !config.canvas)
            return;
        this.canvas = config.canvas;
        const ctx = this.canvas.getContext("2d");
        if (!ctx)
            throw new Error_1.ConfigurationError("Could not configure Renderer: Your browser does not support CanvasRenderingContext2D.");
        this.context = ctx;
        /** Ensure the canvas stays in bounds. */
        window.addEventListener("resize", () => {
            this.canvas.width = window.innerWidth * window.devicePixelRatio;
            this.canvas.height = window.innerHeight * window.devicePixelRatio;
        });
        window.dispatchEvent(new Event("resize"));
        this.configure(config);
        requestAnimationFrame(this.render.bind(this));
    }
    ;
    /** Configures the renderer. */
    configure(config) {
        this.rendering = {
            canvas: this.canvas,
            background: config.background || Enums_1.Colors.White,
            hooks: config.hooks || {},
            gridSize: config.gridSize || 0,
            gridColor: config.gridColor || Enums_1.Colors.Black,
            gridWidth: config.gridWidth || 1,
        };
    }
    ;
    /** Renders the system. */
    render() {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        /** Update framerate information. */
        this.framerate.dt = performance.now() - this.framerate.lastUpdate;
        this.framerate.lastUpdate = performance.now();
        if (this.framerate.fpsArr.length > 30)
            this.framerate.fpsArr.shift();
        this.framerate.fpsArr.push(this.framerate.dt);
        let avg = 0;
        for (const fps of this.framerate.fpsArr)
            avg += fps;
        this.framerate.fps = Math.round(1000 / (avg / this.framerate.fpsArr.length));
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.context.save();
        /** Render the background, boundaries, and grid. */
        this.context.fillStyle = this.rendering.background;
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
        if (this.rendering.gridSize !== 0) {
            this.context.strokeStyle = this.rendering.gridColor;
            this.context.lineWidth = this.rendering.gridWidth;
            for (let x = 0; x < this.canvas.width; x += this.rendering.gridSize) {
                this.context.beginPath();
                this.context.moveTo(x, 0);
                this.context.lineTo(x, this.canvas.height);
                this.context.stroke();
            }
            ;
            for (let y = 0; y < this.canvas.height; y += this.rendering.gridSize) {
                this.context.beginPath();
                this.context.moveTo(0, y);
                this.context.lineTo(this.canvas.width, y);
                this.context.stroke();
            }
            ;
        }
        ;
        this.context.strokeStyle = this.rendering.gridColor;
        /** Render the entities. */
        this.context.translate(this.canvas.width / 2, this.canvas.height / 2);
        this.context.scale(this.system.camera.zoom, this.system.camera.zoom);
        (_b = (_a = this.rendering.hooks).preRender) === null || _b === void 0 ? void 0 : _b.call(_a, this.context);
        for (const entity of this.system.entities) {
            if (!entity)
                continue;
            this.context.save();
            (_d = (_c = entity.rendering.hooks).preRender) === null || _d === void 0 ? void 0 : _d.call(_c, entity, this.context);
            entity.render(this.context);
            (_f = (_e = entity.rendering.hooks).postRender) === null || _f === void 0 ? void 0 : _f.call(_e, entity, this.context);
            this.context.restore();
        }
        ;
        this.context.restore();
        (_h = (_g = this.rendering.hooks).postRender) === null || _h === void 0 ? void 0 : _h.call(_g, this.context);
        requestAnimationFrame(this.render.bind(this));
    }
    ;
}
exports["default"] = Renderer;


/***/ }),

/***/ 91:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
/** A vector in 2D space, represents a direction and magnitude simultaneously. */
class Vector {
    constructor(x, y) {
        /** The coordinates of the vector. */
        this.x = 0;
        this.y = 0;
        this.x = x;
        this.y = y;
    }
    /** Converts polar coordinates to Cartesian coordinates. */
    static toCartesian(r, theta) {
        return new Vector(r * Math.cos(theta), r * Math.sin(theta));
    }
    /** Adds to a vector. */
    add(vector) {
        this.x += vector.x;
        this.y += vector.y;
        return this;
    }
    /** Subtracts from a vector. */
    subtract(vector) {
        this.x -= vector.x;
        this.y -= vector.y;
        return this;
    }
    /** Scales from a vector. */
    scale(scalar) {
        this.x *= scalar;
        this.y *= scalar;
        return this;
    }
    /** Normalizes the vector. */
    normalize() {
        const magnitude = this.magnitude;
        if (magnitude === 0)
            this.x = this.y = 0;
        else {
            this.x /= magnitude;
            this.y /= magnitude;
        }
        return this;
    }
    /** Gets the distance from another vector. */
    distance(vector) {
        return this.clone.subtract(vector).magnitude;
    }
    /** Gets the dot product of two vectors. */
    dot(vector) {
        return this.x * vector.x + this.y * vector.y;
    }
    /** Gets the cross product of two vectors. */
    cross(vector) {
        return this.x * vector.y - this.y * vector.x;
    }
    /** Gets the projection of the current vector onto another vector. */
    project(vector) {
        if (vector.x === 0 && vector.y === 0)
            return new Vector(0, 0);
        return vector.clone.scale(this.dot(vector) / vector.magnitudeSq);
    }
    ;
    /** Creates a vector directionally orthogonal to the current vector. */
    get orthogonal() {
        return new Vector(-this.y, this.x);
    }
    /** Gets the angle of the vector from a reference point. */
    angle(reference = { x: 0, y: 0 }) {
        return Math.atan2(this.y - reference.y, this.x - reference.x);
    }
    /** Rotates the angle to a new angle. */
    set direction(angle) {
        const magnitude = this.magnitude;
        this.x = magnitude * Math.cos(angle);
        this.y = magnitude * Math.sin(angle);
    }
    /** Gets the squared magnitude of the vector. */
    get magnitudeSq() {
        return this.x * this.x + this.y * this.y;
    }
    ;
    /** Gets the magnitude (length) of the vector. */
    get magnitude() {
        return Math.sqrt(this.magnitudeSq);
    }
    ;
    /** Sets the magnitude (length) of the vector. */
    set magnitude(magnitude) {
        const angle = this.angle();
        this.x = magnitude * Math.cos(angle);
        this.y = magnitude * Math.sin(angle);
    }
    ;
    /** Clones the vector. */
    get clone() {
        return new Vector(this.x, this.y);
    }
}
exports["default"] = Vector;
;


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
var exports = __webpack_exports__;
var __webpack_unused_export__;

// import System from "../src/System";
// import Circle from "../src/entities/shapes/Circle";
// import Entity from "../src/entities/Entity";
// import { Colors, Movement } from "../src/typings/Enums";
// import Vector from "../src/utils/Vector";
__webpack_unused_export__ = ({ value: true });
const Index_1 = __webpack_require__(296);
/** @ts-ignore */
const cellSize = window.cellSize = Math.pow(2, 6);
function calculateApothem(width, height, centerX, centerY) {
    const halfWidth = width / 2;
    const halfHeight = height / 2;
    const diagonal = Math.sqrt(Math.pow(halfWidth, 2) + Math.pow(halfHeight, 2));
    const radius = Math.max(diagonal, Math.abs(centerX), Math.abs(centerY));
    return radius;
}
;
const canvas = document.getElementById("canvas");
canvas.width = window.innerWidth * window.devicePixelRatio;
canvas.height = window.innerHeight * window.devicePixelRatio;
/** STATS */
const fps = document.getElementById('fps');
const momentum = document.getElementById('momentum');
const kineticEnergy = document.getElementById('ke');
const worldUpdateRate = document.getElementById('tickRate');
const memoryUsage = document.getElementById('memoryUsage');
/** CONTROLS */
const showHitbox = document.getElementById('showHitbox');
const showVectors = document.getElementById('showVectors');
function invertColor(hex) {
    if (hex.indexOf('#') === 0)
        hex = hex.slice(1);
    if (hex.length === 3)
        hex = `${hex[0]}${hex[0]}${hex[1]}${hex[1]}${hex[2]}${hex[2]}`;
    if (hex.length !== 6)
        return "#000000";
    var r = (255 - parseInt(hex.slice(0, 2), 16)).toString(16), g = (255 - parseInt(hex.slice(2, 4), 16)).toString(16), b = (255 - parseInt(hex.slice(4, 6), 16)).toString(16);
    return `#${r.padStart(2, "0")}${g.padStart(2, "0")}${b.padStart(2, "0")}`;
}
const width = 1920;
const height = 1080;
const centerX = width / 2;
const centerY = height / 2;
const sysRad = calculateApothem(width, height, centerX, centerY);
console.log(sysRad);
/** @ts-ignore */
const system = window.system = new Index_1.System({
    tickRate: 60,
    friction: 0.1,
    gravity: 0,
    collisionInfo: {
        cellSize: Math.log2(cellSize),
    },
    camera: {
        zoom: 1,
    },
    dimensions: new Index_1.Vector(width, height),
    // bounds: {
    //     sides: 4,
    //     radius: 1_000,
    //     rotation: Math.PI / 4,
    //     config: {
    //         render: { 
    //             strokeColor: Colors.Red,
    //             // fillColor: Colors.Red,
    //             strokeWidth: 5,
    //             hooks: {
    //                 postRender: function(entity: Entity, context: CanvasRenderingContext2D) {
    //                     const { bounds: { min }, center, velocity, hitbox } = entity;
    //                     if (showHitbox.checked) {
    //                         context.strokeStyle = Colors.Blue;
    //                         context.lineWidth = 10;
    //                         context.strokeRect(min.x, -min.y, hitbox.x, -hitbox.y);
    //                     }
    //                     if (showVectors.checked) {
    //                         context.strokeStyle = invertColor(entity.rendering.fillColor || "#FF0000");
    //                         context.lineWidth = 1;
    //                         context.beginPath();
    //                         context.moveTo(center.x, -center.y);
    //                         context.lineTo(center.x + (velocity.x) * 10, -center.y - (velocity.y) * 10);
    //                         context.stroke();
    //                     }
    //                     context.beginPath();
    //                     context.arc(entity.center.x, entity.center.y, 5, 0, 2 * Math.PI);
    //                     context.fillStyle = Colors.Blue;
    //                     context.fill();
    //                 }
    //             }
    //         },
    //         thickness: 100,
    //         elasticity: 1
    //         // static: true
    //     }
    // },
    // useRAF: true,
    render: {
        canvas,
        background: "rgb(5, 28, 31)",
        gridColor: "#FFFFFF",
        gridWidth: 1,
        // gridSize: cellSize,
        hooks: {
            preRender: function (context) {
                const width = window.innerWidth;
                const height = window.innerHeight;
                const topLeft = new Index_1.Vector(-width, height);
                context.strokeStyle = Index_1.Colors.Red;
                context.lineWidth = 1;
                context.beginPath();
                context.strokeRect(topLeft.x, -topLeft.y, width * 2, height * 2);
            },
            postRender: function (context) {
                var _a;
                fps.innerText = system.renderer.framerate.fps.toFixed(2);
                momentum.innerText = system.momentum.toFixed(2);
                kineticEnergy.innerText = system.kineticEnergy.toFixed(2);
                worldUpdateRate.innerText = `${(1000 / (system.performance.worldUpdateRate || 1E-4)).toFixed(1)} hZ (${system.performance.worldUpdateRate.toFixed(2)} ms)`;
                memoryUsage.innerText = `${system.performance.memoryUsage.toFixed(2)} MB`;
                /** @ts-ignore */
                const keys = window.keys;
                const entity = system.entities[0];
                if (keys.size) {
                    (_a = entity === null || entity === void 0 ? void 0 : entity.move) === null || _a === void 0 ? void 0 : _a.call(entity, ...keys);
                }
                // (0, 0) is centerX, centerY
                // const width = width / 2;
                // const height = height / 2;
            },
        },
    },
});
// rectangle top
const top = new Index_1.Entity({
    form: { vertices: [
            // 4 vertices
            new Index_1.Vector(-width / 2, -height / 2),
            new Index_1.Vector(width / 2, -height / 2),
            new Index_1.Vector(width / 2, -height / 2 + 100),
            new Index_1.Vector(-width / 2, -height / 2 + 100),
        ], },
    mass: 10,
    speed: 1,
    rotate: false,
    elasticity: 1.5,
    angularSpeed: 1,
    render: {
        strokeColor: Index_1.Colors.Red,
        // fillColor: Colors.Red,
        strokeWidth: 1,
        hooks: {
            postRender: function (entity, context) {
                const { bounds: { min }, position: center, velocity, hitbox } = entity;
                if (showHitbox.checked) {
                    context.strokeStyle = Index_1.Colors.Blue;
                    context.lineWidth = 1;
                    context.strokeRect(min.x, -min.y, hitbox.x, -hitbox.y);
                }
                if (showVectors.checked) {
                    context.strokeStyle = invertColor(entity.rendering.fillColor || "#FF0000");
                    context.lineWidth = 1;
                    context.beginPath();
                    context.moveTo(center.x, -center.y);
                    context.lineTo(center.x + (velocity.x) * 10, -center.y - (velocity.y) * 10);
                    context.stroke();
                }
                context.beginPath();
                context.arc(min.x, -min.y, 5, 0, 2 * Math.PI);
                context.fillStyle = Index_1.Colors.Blue;
                context.fill();
                context.beginPath();
                context.arc(center.x, -center.y, 5, 0, 2 * Math.PI);
                context.fillStyle = Index_1.Colors.Blue;
                context.fill();
            }
        }
        // glowIntensity: 10000,
    },
    static: true,
}, system);
// rectangle bottom
const bottom = new Index_1.Entity({
    form: { vertices: [
            // 4 vertices
            new Index_1.Vector(-width / 2, height / 2),
            new Index_1.Vector(width / 2, height / 2),
            new Index_1.Vector(width / 2, height / 2 - 100),
            new Index_1.Vector(-width / 2, height / 2 - 100),
        ], },
    mass: 10,
    speed: 1,
    rotate: false,
    elasticity: 1.5,
    angularSpeed: 1,
    render: {
        strokeColor: Index_1.Colors.Red,
        // fillColor: Colors.Red,
        strokeWidth: 1,
        hooks: {
            postRender: function (entity, context) {
                const { bounds: { min }, position: center, velocity, hitbox } = entity;
                if (showHitbox.checked) {
                    context.strokeStyle = Index_1.Colors.Blue;
                    context.lineWidth = 1;
                    context.strokeRect(min.x, -min.y, hitbox.x, -hitbox.y);
                }
                if (showVectors.checked) {
                    context.strokeStyle = invertColor(entity.rendering.fillColor || "#FF0000");
                    context.lineWidth = 1;
                    context.beginPath();
                    context.moveTo(center.x, -center.y);
                    context.lineTo(center.x + (velocity.x) * 10, -center.y - (velocity.y) * 10);
                    context.stroke();
                }
                context.beginPath();
                context.arc(min.x, -min.y, 5, 0, 2 * Math.PI);
                context.fillStyle = Index_1.Colors.Blue;
                context.fill();
                context.beginPath();
                context.arc(center.x, -center.y, 5, 0, 2 * Math.PI);
                context.fillStyle = Index_1.Colors.Blue;
                context.fill();
            }
        }
        // glowIntensity: 10000,
    },
    static: true
}, system);
// rectangle left
const left = new Index_1.Entity({
    form: { vertices: [
            // 4 vertices
            new Index_1.Vector(-width / 2, -height / 2),
            new Index_1.Vector(-width / 2 + 100, -height / 2),
            new Index_1.Vector(-width / 2 + 100, height / 2),
            new Index_1.Vector(-width / 2, height / 2),
        ], },
    mass: 10,
    speed: 1,
    rotate: false,
    elasticity: 1.5,
    angularSpeed: 1,
    render: {
        strokeColor: Index_1.Colors.Red,
        // fillColor: Colors.Red,
        strokeWidth: 1,
        hooks: {
            postRender: function (entity, context) {
                const { bounds: { min }, position: center, velocity, hitbox } = entity;
                if (showHitbox.checked) {
                    context.strokeStyle = Index_1.Colors.Blue;
                    context.lineWidth = 1;
                    context.strokeRect(min.x, -min.y, hitbox.x, -hitbox.y);
                }
                if (showVectors.checked) {
                    context.strokeStyle = invertColor(entity.rendering.fillColor || "#FF0000");
                    context.lineWidth = 1;
                    context.beginPath();
                    context.moveTo(center.x, -center.y);
                    context.lineTo(center.x + (velocity.x) * 10, -center.y - (velocity.y) * 10);
                    context.stroke();
                }
                context.beginPath();
                context.arc(min.x, -min.y, 5, 0, 2 * Math.PI);
                context.fillStyle = Index_1.Colors.Blue;
                context.fill();
                context.beginPath();
                context.arc(center.x, -center.y, 5, 0, 2 * Math.PI);
                context.fillStyle = Index_1.Colors.Blue;
                context.fill();
            }
        },
        glowIntensity: 10000,
    },
    static: true
}, system);
// rectangle right
const right = new Index_1.Entity({
    form: { vertices: [
            // 4 vertices
            new Index_1.Vector(width / 2, -height / 2),
            new Index_1.Vector(width / 2 - 100, -height / 2),
            new Index_1.Vector(width / 2 - 100, height / 2),
            new Index_1.Vector(width / 2, height / 2),
        ], },
    mass: 10,
    speed: 1,
    rotate: false,
    elasticity: 1.5,
    angularSpeed: 1,
    render: {
        strokeColor: Index_1.Colors.Red,
        hooks: {
            postRender: function (entity, context) {
                const { bounds: { min }, position: center, velocity, hitbox } = entity;
                if (showHitbox.checked) {
                    context.strokeStyle = Index_1.Colors.Blue;
                    context.lineWidth = 1;
                    context.strokeRect(min.x, -min.y, hitbox.x, -hitbox.y);
                }
                if (showVectors.checked) {
                    context.strokeStyle = invertColor(entity.rendering.fillColor || "#FF0000");
                    context.lineWidth = 1;
                    context.beginPath();
                    context.moveTo(center.x, -center.y);
                    context.lineTo(center.x + (velocity.x) * 10, -center.y - (velocity.y) * 10);
                    context.stroke();
                }
                context.beginPath();
                context.arc(min.x, -min.y, 5, 0, 2 * Math.PI);
                context.fillStyle = Index_1.Colors.Blue;
                context.fill();
                context.beginPath();
                context.arc(center.x, -center.y, 5, 0, 2 * Math.PI);
                context.fillStyle = Index_1.Colors.Blue;
                context.fill();
            }
        },
        // fillColor: Colors.Red,
        strokeWidth: 1,
        // glowIntensity: 10000,
    },
    static: true
}, system);
system.on("entityCreate", (entity) => {
    console.log("A new entity has been created.", entity.id);
});
system.on("entityDelete", (entity) => {
    console.log("An entity has been deleted.", entity.id);
});
// system.addEntity(top);
// system.addEntity(bottom);
// system.addEntity(left);
// system.addEntity(right);
function generatePolygon(sides, radius, rotation, centerX = 0, centerY = 0) {
    const angleStep = (Math.PI * 2) / sides;
    const vertices = [];
    for (let i = 0; i < sides; i++) {
        const startAngle = angleStep * i + rotation;
        const x = centerX + radius * Math.cos(startAngle);
        const y = centerY + radius * Math.sin(startAngle);
        vertices.push(new Index_1.Vector(x, y));
    }
    return vertices;
}
;
/** @ts-ignore */
const arrowVertices = '40 0 40 20 100 20 100 80 40 80 40 100 0 50'
    .split(' ')
    .map((v, i, a) => i % 2 ? new Index_1.Vector(+a[i - 1], +v) : null)
    .filter(v => v);
/** @ts-ignore */
const chevron = '100 0 75 50 100 100 25 100 0 50 25 0'
    .split(' ')
    .map((v, i, a) => i % 2 ? new Index_1.Vector(+a[i - 1], +v) : null)
    .filter(v => v);
/** @ts-ignore */
const star = '50 0 63 38 100 38 69 59 82 100 50 75 18 100 31 59 0 38 37 38'
    .split(' ')
    .map((v, i, a) => i % 2 ? new Index_1.Vector(+a[i - 1], +v) : null)
    .filter(v => v);
console.log(star);
/** @ts-ignore */
const heart = '50 0 100 0 100 50 50 100 0 50 0 0'
    .split(' ')
    .map((v, i, a) => i % 2 ? new Index_1.Vector(+a[i - 1], +v) : null)
    .filter(v => v);
const opts = {
    mass: 10,
    speed: 1,
    elasticity: 1,
    angularSpeed: 1,
    render: {
        strokeColor: Index_1.Colors.Red,
        // fillColor: Colors.Red,
        strokeWidth: 1,
        // glowIntensity: 10000,
        hooks: {
            postRender: function (entity, context) {
                const { bounds: { min }, position: center, velocity, hitbox } = entity;
                if (showHitbox.checked) {
                    context.strokeStyle = Index_1.Colors.Red;
                    context.lineWidth = 1;
                    context.strokeRect(min.x, -min.y, hitbox.x, -hitbox.y);
                }
                if (showVectors.checked) {
                    context.strokeStyle = invertColor(entity.rendering.fillColor || "#FF0000");
                    context.lineWidth = 1;
                    context.beginPath();
                    context.moveTo(center.x, -center.y);
                    context.lineTo(center.x + (velocity.x) * 10, -center.y - (velocity.y) * 10);
                    context.stroke();
                }
            }
        }
    },
};
// const arrow = new Entity({
//     vertices: arrowVertices,
//     ...opts,
// }, system);
// const chevronEntity = new Entity({
//     vertices: chevron,
//     ...opts,
// }, system);
// const starEntity = new Entity({
//     form: { vertices: star, },
//     ...opts,
// }, system);
// const heartEntity = new Entity({
//     vertices: heart,
//     ...opts,
// }, system);
const amongUsShape = [
    [0, 40],
    [10, 30],
    [20, 30],
    [30, 40],
    [20, 50],
    [10, 50] // Vertex 6
].map(([x, y]) => new Index_1.Vector(x, y));
// system.addEntity(compound);
// const amongUs = new Entity({
//     vertices: amongUsShape,
//     ...opts,
// }, system);
for (let i = 0; i < 0; i++) {
    const ent2 = new Index_1.Circle(Object.assign({ form: { vertices: [new Index_1.Vector(1000 * Math.random(), 1000 * Math.random())] }, radius: 50 }, opts), system);
    // system.addEntity(ent2);
}
for (let i = 0; i < 2; i++) {
    const isCircle = Math.random() <= 1;
    /** random x & y coordinates which can be negative (given system.radius) */
    let x = i === 0 ? 0 : Math.random() * ((sysRad - 2000) * 2) - (sysRad - 2000);
    const y = i === 0 ? 0 : Math.random() * ((sysRad - 2000) * 2) - (sysRad - 2000);
    // if (x == 0) x = -100;
    // if (x > 0) x = -x - 100;
    const sides = 3;
    // const sides = 4;
    const radius = 50;
    const color = [
        "#F177DD",
        "#FC7677",
        "#F14E54",
        "#FFE869",
        "#FCC376",
        "#FFA500",
        "#00E16E",
        "#43FF91",
        "#8AFF69",
        "#00B2E1",
        "#768DFC",
        "#C0C0C0",
    ];
    const entColor = color[Math.floor(Math.random() * color.length)] || Index_1.Colors.Red;
    if (isCircle) {
        const ent = new Index_1.Circle({
            form: { vertices: [new Index_1.Vector(x < 0 ? x : -x, y)], },
            radius,
            mass: 10,
            speed: 1,
            elasticity: 1,
            angularSpeed: 0.01,
            render: {
                strokeColor: entColor,
                strokeWidth: 1,
                // glowIntensity: 10000,
                hooks: {
                    postRender: function (entity, context) {
                        const { bounds: { min }, position: center, velocity, hitbox } = entity;
                        if (showHitbox.checked) {
                            context.strokeStyle = Index_1.Colors.Red;
                            context.lineWidth = 1;
                            context.strokeRect(min.x, -min.y, hitbox.x, -hitbox.y);
                        }
                        if (showVectors.checked) {
                            context.strokeStyle = invertColor(entity.rendering.fillColor || "#FF0000");
                            context.lineWidth = 1;
                            context.beginPath();
                            context.moveTo(center.x, -center.y);
                            context.lineTo(center.x + (velocity.x) * 10, -center.y - (velocity.y) * 10);
                            context.stroke();
                        }
                    }
                }
            },
        }, system);
        system.addEntity(ent);
    }
    else {
        const ent = new Index_1.Entity({
            form: {
                sides,
                radius,
                offset: { x, y }
                // vertices: generatePolygon(sides, radius, 0, x, y),   
            },
            // vertices: generatePolygon(sides, radius, 0, x, y),
            mass: 10,
            speed: 10,
            elasticity: 1,
            angularSpeed: 1,
            rotate: true,
            render: {
                // fillColor: entColor,
                strokeColor: entColor,
                strokeWidth: 1,
                // glowIntensity: 10000,
                hooks: {
                    postRender: function (entity, context) {
                        const { bounds: { min }, position: center, velocity, hitbox } = entity;
                        if (showHitbox.checked) {
                            context.strokeStyle = Index_1.Colors.Red;
                            context.lineWidth = 1;
                            context.strokeRect(min.x, -min.y, hitbox.x, -hitbox.y);
                        }
                        if (showVectors.checked) {
                            context.strokeStyle = invertColor(entity.rendering.fillColor || "#FF0000");
                            context.lineWidth = 1;
                            context.beginPath();
                            context.moveTo(center.x, -center.y);
                            context.lineTo(center.x + (velocity.x) * 10, -center.y - (velocity.y) * 10);
                            context.stroke();
                        }
                    }
                },
            },
        }, system);
        system.addEntity(ent);
    }
}
;
/** @ts-ignore */
const keys = window.keys = new Set();
document.addEventListener("keydown", function ({ key, code }) {
    switch (key) {
        case "ArrowUp":
            keys.add(Index_1.Movement.Up);
            break;
        case "ArrowDown":
            keys.add(Index_1.Movement.Down);
            break;
        case "ArrowLeft":
            keys.add(Index_1.Movement.Left);
            break;
        case "ArrowRight":
            keys.add(Index_1.Movement.Right);
            break;
    }
    switch (code) {
        case "KeyW":
            keys.add(Index_1.Movement.Up);
            break;
        case "KeyS":
            keys.add(Index_1.Movement.Down);
            break;
        case "KeyA":
            keys.add(Index_1.Movement.Left);
            break;
        case "KeyD":
            keys.add(Index_1.Movement.Right);
            break;
    }
});
document.addEventListener("keyup", function ({ key, code }) {
    switch (key) {
        case "ArrowUp":
            keys.delete(Index_1.Movement.Up);
            break;
        case "ArrowDown":
            keys.delete(Index_1.Movement.Down);
            break;
        case "ArrowLeft":
            keys.delete(Index_1.Movement.Left);
            break;
        case "ArrowRight":
            keys.delete(Index_1.Movement.Right);
            break;
    }
    switch (code) {
        case "KeyW":
            keys.delete(Index_1.Movement.Up);
            break;
        case "KeyS":
            keys.delete(Index_1.Movement.Down);
            break;
        case "KeyA":
            keys.delete(Index_1.Movement.Left);
            break;
        case "KeyD":
            keys.delete(Index_1.Movement.Right);
            break;
    }
});
document.addEventListener("click", function ({ clientX, clientY }) {
    // todo: map (clientX, clientY) -> (systemX, systemY)
});
document.addEventListener("wheel", function ({ deltaY }) {
    system.camera.zoom += deltaY * (localStorage.sensitivity || 0.001);
});

})();

/******/ })()
;