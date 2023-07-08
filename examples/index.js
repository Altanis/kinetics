const { System, Circle, Entity, Colors, Movement, Vector } = window.Kinetics;
/** @ts-ignore */
const cellSize = window.cellSize = 2 ** 6;
function calculateApothem(width, height, centerX, centerY) {
    const halfWidth = width / 2;
    const halfHeight = height / 2;
    const diagonal = Math.sqrt(halfWidth ** 2 + halfHeight ** 2);
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
const width = 1920 * window.devicePixelRatio - 500;
const height = 1080 * window.devicePixelRatio - 500;
const centerX = width / 2;
const centerY = height / 2;
const sysRad = calculateApothem(width, height, centerX, centerY);
console.log(sysRad);
/** @ts-ignore */
const system = window.system = new System({
    tickRate: 60,
    friction: 0.1,
    gravity: 0,
    collisionInfo: {
        cellSize: Math.log2(cellSize),
    },
    camera: {
        zoom: 1,
    },
    dimensions: new Vector(width, height),
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
                const halfWidth = system.width / 2;
                const halfHeight = system.height / 2;

                const topLeft = {x: -halfWidth, y: -halfHeight};

                context.strokeStyle = Colors.Peach;
                context.strokeRect(topLeft.x, topLeft.y, system.width, system.height);
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
        // fillColor: Colors.Red,
        strokeWidth: 1,
        // glowIntensity: 10000,
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
//     vertices: heart,
//     ...opts,
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

const car = new Entity({
    form: {
        components: [
            {
                form: {
                    vertices: [
                        new Vector(0, 0),
                        new Vector(0, 200),
                        new Vector(200, 200),
                        new Vector(200, 0),
                    ],
                },
                speed: 10,
                elasticity: 1,
                angularSpeed: 1,
                mass: 1,
                render: {
                    strokeColor: Colors.Red,
                }
            },
            {
                form: {
                    vertices: [new Vector(50, -20)]
                },
                radius: 20,
                speed: 10,
                elasticity: 1,
                angularSpeed: 1,
                mass: 1,
                render: {
                    strokeColor: Colors.Green,
                }
            },
            {
                form: {
                    vertices: [new Vector(150, -20)]
                },
                radius: 20,
                speed: 10,
                elasticity: 1,
                angularSpeed: 1,
                mass: 1,
                render: {
                    strokeColor: Colors.Green,
                }
            }
        ]
    },
    ...opts,
}, system);
// system.addEntity(car);


for (let i = 0; i < 0; i++) {
    const ent2 = new Circle(Object.assign({ form: { vertices: [new Vector(1000 * Math.random(), 1000 * Math.random())] }, radius: 50 }, opts), system);
    // system.addEntity(ent2);
}
for (let i = 0; i < 2; i++) {
    const isCircle = Math.random() >= 1;
    /** random x & y coordinates which can be negative (given system.radius) */
    let x = i === 0 ? 0 : Math.random() * ((sysRad - 2000) * 2) - (sysRad - 2000);
    const y = i === 0 ? 0 : Math.random() * ((sysRad - 2000) * 2) - (sysRad - 2000);
    // if (x == 0) x = -100;
    // if (x > 0) x = -x - 100;
    const sides = i == 0 ? 3 : 4
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
    if (isCircle) {
        const ent = new Circle({
            form: { vertices: [new Vector(x < 0 ? x : -x, y)], },
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
            mass: 10,
            speed: 1,
            elasticity: 1,
            angularSpeed: 0.01,
            render: {
                // fillColor: entColor,
                strokeColor: entColor,
                strokeWidth: 1,
                // glowIntensity: 10000,
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