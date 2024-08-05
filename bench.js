const { System, Entity, Circle, Vector } = require("./dist/Index");

const system = new System({
    friction: 0.1,
    gravity: 0,
    collisionInfo: {
        cellSize: 6,
    },
    camera: {
        zoom: 1,
    },
    bounds: new Vector(1920, 1080)
});

const FPS = 60;
const MSPT = 1000 / 60;

function random(min, max) {
    return Math.random() * (max - min) + min;
};

function calculateRadius(width, height, centerX, centerY) {
    const halfWidth = width / 2;
    const halfHeight = height / 2;
    const diagonal = Math.sqrt(halfWidth ** 2 + halfHeight ** 2);
    const radius = Math.max(diagonal, Math.abs(centerX), Math.abs(centerY));
    return radius;
};

// const sysRad = calculateRadius(1920, 1080, 1920 / 2, 1080 / 2);
const sysRad = calculateRadius(1920, 1080, 1920 / 2, 1080 / 2);

// Insert 50,000 pentagons.
for (let i = 0; i < 50_000; i++) {
    const x = Math.random() * ((sysRad - 2000) * 2) - (sysRad - 2000);
    const y = Math.random() * ((sysRad - 2000) * 2) - (sysRad - 2000);

    const radius = random(3, 13);

    const entity = new Entity(
        {
            form: {
                // vertices: [new Vector(x, y)],
                sides: 5,
                radius,
                offset: { x, y }
            },
            radius,
            mass: 10,
            speed: 1,
            rotate: false,
            elasticity: 1,
            angularSpeed: 1,
            // sleepThreshold: 1E-6
        },
        system
    );
    system.addEntity(entity);
}

let lastTickTimestamp = 0;

setInterval(() => {
    let currentTime = performance.now();
    let deltaTime = currentTime - lastTickTimestamp;
    lastTickTimestamp = currentTime;

    let dt = Math.min((deltaTime / MSPT), 3);

    system.update(dt);
    console.log("wur/mem", system.performance.worldUpdateRate, " ", system.performance.memoryUsage)
}, 1000 / FPS);