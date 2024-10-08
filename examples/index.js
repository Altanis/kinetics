const { System, Circle, Entity, Colors, Movement, Vector } = window.Kinetics;

class Colour {
    static from_rgb(r, g, b) {
        return new Colour(r << 16 | g << 8 | b << 0);
    }
    static from_hex(hex) {
        return new Colour(parseInt(hex, 16));
    }
    static blend_colours(primary, secondary, factor) {
        const c = new Colour(primary.int);
        c.blend_with(factor, secondary);
        return c;
    }
    get int() {
        return this.r << 16 | this.g << 8 | this.b << 0;
    }
    get css() {
        return `rgb(${this.r}, ${this.g}, ${this.b})`;
    }
    get r() { return this._r; }
    ;
    set r(v) { this._r = v & 255; }
    ;
    get g() { return this._g; }
    ;
    set g(v) { this._g = v & 255; }
    ;
    get b() { return this._b; }
    ;
    set b(v) { this._b = v & 255; }
    ;
    constructor(colour) {
        this._r = 0;
        this._g = 0;
        this._b = 0;
        this.r = (colour >>> 16) & 255;
        this.g = (colour >>> 8) & 255;
        this.b = (colour >>> 0) & 255;
    }
    blend_with(factor, colour) {
        this.r = Math.round(colour.r * factor + this.r * (1 - factor));
        this.g = Math.round(colour.g * factor + this.g * (1 - factor));
        this.b = Math.round(colour.b * factor + this.b * (1 - factor));
        return this;
    }
    grayscale() {
        const avg = (this.r + this.g + this.b) / 3;
        this.r = avg;
        this.g = avg;
        this.b = avg;
        return this;
    }
    invert() {
        this.r = 255 - this.r;
        this.g = 255 - this.g;
        this.b = 255 - this.b;
        return this;
    }
    clone() {
        return new Colour(this.int);
    }
}
Colour.BLACK = Colour.from_rgb(0, 0, 0);
Colour.WHITE = Colour.from_rgb(255, 255, 255);

const cellSize = window.cellSize = 2 ** 6;
function calculateApothem(width, height, centerX, centerY) {
    const halfWidth = width / 2;
    const halfHeight = height / 2;
    const diagonal = Math.sqrt(halfWidth ** 2 + halfHeight ** 2);
    const radius = Math.max(diagonal, Math.abs(centerX), Math.abs(centerY));
    return radius;
};

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

const width = 1920 * window.devicePixelRatio - 100;
const height = 1080 * window.devicePixelRatio - 300;
const centerX = width / 2;
const centerY = height / 2;
const sysRad = calculateApothem(width, height, centerX, centerY);
console.log(sysRad);
/** @ts-ignore */
const system = window.system = new System({
    friction: 0.1,
    gravity: 0,
    collisionInfo: {
        cellSize: Math.log2(cellSize),
    },
    camera: {
        zoom: 1,
    },
    dimensions: new Vector(width, height),
    render: {
        canvas,
        background: "#CDCDCD",
        gridColor: "#000000",
        gridWidth: 1,
        hooks: {
            preRender: function (context) {
                const halfWidth = (system.width + 100) / 2;
                const halfHeight = (system.height + 100) / 2;

                const topLeft = {x: -halfWidth, y: -halfHeight};

                context.strokeStyle = "#5B5B5B";
                context.lineWidth = 10;
                context.strokeRect(topLeft.x, topLeft.y, system.width + 100, system.height + 100);
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
                    const FORCE = 1;
                    const force_vector = new Vector(0, 0);

                    if (keys.has(Movement.Up)) force_vector.y += 1;
                    if (keys.has(Movement.Down)) force_vector.y -= 1;
                    if (keys.has(Movement.Left)) force_vector.x -= 1;
                    if (keys.has(Movement.Right)) force_vector.x += 1;

                    entity.applyForce(force_vector.normalize().scale(FORCE));
                }
                // (0, 0) is centerX, centerY
                // const width = width / 2;
                // const height = height / 2;
            },
        },
    },
});
system.camera.zoom = 0.72;
system.on("entityCreate", (entity) => {
    console.log("A new entity has been created.", entity.id);
});
system.on("entityDelete", (entity) => {
    console.log("An entity has been deleted.", entity.id);
});
function generatePolygon(sides, radius, rotation, centerX = 0, centerY = 0) {
    const angleStep = (Math.PI * 2) / sides;
    const vertices = [];
    for (let i = 0; i < sides; i++) {
        const startAngle = angleStep * i + rotation;
        const x = centerX + radius * Math.cos(startAngle);
        const y = centerY + radius * Math.sin(startAngle);
        vertices.push(new Vector(x, y));
    }
    return vertices;
}
;
/** @ts-ignore */
const arrowVertices = '40 0 40 20 100 20 100 80 40 80 40 100 0 50'
    .split(' ')
    .map((v, i, a) => i % 2 ? new Vector(+a[i - 1], +v) : null)
    .filter(v => v);
/** @ts-ignore */
const chevron = '100 0 75 50 100 100 25 100 0 50 25 0'
    .split(' ')
    .map((v, i, a) => i % 2 ? new Vector(+a[i - 1], +v) : null)
    .filter(v => v);
/** @ts-ignore */
const star = '50 0 63 38 100 38 69 59 82 100 50 75 18 100 31 59 0 38 37 38'
    .split(' ')
    .map((v, i, a) => i % 2 ? new Vector(+a[i - 1], +v) : null)
    .filter(v => v);
console.log(star);
/** @ts-ignore */
const heart = '50 0 100 0 100 50 50 100 0 50 0 0'
    .split(' ')
    .map((v, i, a) => i % 2 ? new Vector(+a[i - 1], +v) : null)
    .filter(v => v);
const opts = {
    mass: 10,
    speed: 1,
    elasticity: 1,
    angularSpeed: 1,
    render: {
        strokeColor: Colors.Red,
        strokeWidth: 1,
        hooks: {
            postRender: function (entity, context) {
                const { bounds: { min }, position: center, velocity, hitbox } = entity;
                if (showHitbox.checked) {
                    context.strokeStyle = Colors.Red;
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
// }, system);jus
// const heartEntity = new Entity({
    // form: { vertices: chevron },
    // ...opts,
// }, system);
// const amongUsShape = [
//     [0, 40],
//     [10, 30],
//     [20, 30],
//     [30, 40],
//     [20, 50],
//     [10, 50] // Vertex 6
// ].map(([x, y]) => new Vector(x, y));
// system.addEntity(compound);
// const amongUs = new Entity({
//     vertices: amongUsShape,
//     ...opts,
// }, system);

// system.addEntity(heartEntity);

for (let i = 0; i < 0; i++) {
    const ent2 = new Circle(Object.assign({ form: { vertices: [new Vector(1000 * Math.random(), 1000 * Math.random())] }, radius: 50 }, opts), system);
    // system.addEntity(ent2);
}

for (let i = 0; i < 100; i++) {
    const isCircle = Math.random() < 0.5;
    /** random x & y coordinates which can be negative (given system.radius) */
    let x = i === 0 ? 0 : Math.random() * ((sysRad - 2000) * 2) - (sysRad - 2000);
    const y = i === 0 ? 0 : Math.random() * ((sysRad - 2000) * 2) - (sysRad - 2000);
    // if (x == 0) x = -100;
    // if (x > 0) x = -x - 100;
    const sides = Math.floor(Math.random() * 10) + 3;
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
    const entColor = color[Math.floor(Math.random() * color.length)] || Colors.Red;
    console.log(entColor);
    if (isCircle) {
        const ent = new Circle({
            form: { vertices: [new Vector(x < 0 ? x : -x, y)], },
            radius,
            mass: 1,
            elasticity: 1,
            render: {
                fillColor: entColor,
                strokeColor: Colour.blend_colours(Colour.from_hex(entColor.slice(1)), Colour.BLACK, 0.25).css,
                strokeWidth: 4,
                hooks: {
                    postRender: function (entity, context) {
                        const { bounds: { min }, position: center, velocity, hitbox } = entity;
                        if (showHitbox.checked) {
                            context.strokeStyle = Colors.Red;
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
        const ent = new Entity({
            form: {
                sides,
                radius,
                offset: { x, y }
                // vertices: generatePolygon(sides, radius, 0, x, y),   
            },
            // vertices: generatePolygon(sides, radius, 0, x, y),
            mass: 1,
            elasticity: 1,
            rotate: true,
            render: {
                fillColor: entColor,
                strokeColor: Colour.blend_colours(Colour.from_hex(entColor.slice(1)), Colour.BLACK, 0.25).css,
                strokeWidth: 4,
                // glowIntensity: 1,
                hooks: {
                    postRender: function (entity, context) {
                        const { bounds: { min }, position: center, velocity, hitbox } = entity;
                        if (showHitbox.checked) {
                            context.strokeStyle = Colors.Red;
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
            keys.add(Movement.Up);
            break;
        case "ArrowDown":
            keys.add(Movement.Down);
            break;
        case "ArrowLeft":
            keys.add(Movement.Left);
            break;
        case "ArrowRight":
            keys.add(Movement.Right);
            break;
    }
    switch (code) {
        case "KeyW":
            keys.add(Movement.Up);
            break;
        case "KeyS":
            keys.add(Movement.Down);
            break;
        case "KeyA":
            keys.add(Movement.Left);
            break;
        case "KeyD":
            keys.add(Movement.Right);
            break;
    }
});
document.addEventListener("keyup", function ({ key, code }) {
    switch (key) {
        case "ArrowUp":
            keys.delete(Movement.Up);
            break;
        case "ArrowDown":
            keys.delete(Movement.Down);
            break;
        case "ArrowLeft":
            keys.delete(Movement.Left);
            break;
        case "ArrowRight":
            keys.delete(Movement.Right);
            break;
    }
    switch (code) {
        case "KeyW":
            keys.delete(Movement.Up);
            break;
        case "KeyS":
            keys.delete(Movement.Down);
            break;
        case "KeyA":
            keys.delete(Movement.Left);
            break;
        case "KeyD":
            keys.delete(Movement.Right);
            break;
    }
});
document.addEventListener("click", function (event) {
    // todo: map (clientX, clientY) -> (systemX, systemY)
});
document.addEventListener("wheel", function ({ deltaY }) {
    system.camera.zoom += deltaY * (localStorage.sensitivity || 0.001);
});

const MSPT = 1000 / 60;
let lastTickTimestamp = 0;

function update_system() {
    const currentTime = performance.now();
    let deltaTime = currentTime - lastTickTimestamp;
    lastTickTimestamp = currentTime;

    // `dt` is a sort of error correction mechanism.
    // In the event the interval doesn't run at the specified
    // MSPT, `dt` corrects all time variant operations by scaling
    // them by its value.
    let dt = Math.min((deltaTime / MSPT), 3);

    system.update(dt);
    window.requestAnimationFrame(update_system);
}

window.requestAnimationFrame(update_system);