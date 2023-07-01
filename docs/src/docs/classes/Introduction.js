import { Link } from "react-router-dom";
import CodeBlock from "../../components/CodeBlock";
import Banner from "../../static/kinetics.jpeg";

export default function Introduction() {
    return (
        <>
            <Link to="/" className="flex flex-col items-center">
                <img src={Banner} alt="Kinetics.ts Logo" className="w-full md:w-1/2 h-auto" />
            </Link>

            <h2 className="mx-2 text-white text-xl md:text-2xl font-bold underline">About</h2>
            <p className="my-6 mx-2 text-white text-sm md:text-lg">
                <span className="text-accent underline">Kinetics.ts</span> 
                &nbsp;is a powerful NPM library that offers a versatile 2D physics engine for both server-side and web-based environments. With its realistic collision detection and powerful entity handling, developers can create realistic games, educational simulations, and interactive data visualizations with ease. Its extensive functionality and ease of use make it an invaluble tool for building immersive experiences across multiple domains.
            </p>

            <h2 className="mx-2 text-white text-xl md:text-2xl font-bold underline">Installation</h2>
            <p className="my-6 mx-2 text-white text-sm md:text-lg">
                To install Kinetics.ts, ensure you have Node.js installed, and simply run this command in your terminal:
                <CodeBlock children="$ npm install kinetics.ts" language="bash" />
            </p>

            <h2 className="mx-2 text-white text-xl md:text-2xl font-bold underline">Example Usage</h2>
            <p className="my-6 mx-2 text-white text-sm md:md:text-lg">
                <CodeBlock children={`
/** Create a system with 100 circles. */
const {
    System,
    Bodies: { Circle },
    Utils: { Vector },
    Enums: { CollisionManager }
} = require("kinetics.ts");       

const system = new System({
    friction: 0.1,
    gravity: 0.1,
    tickRate: 60,
    collisionManager: CollisionManager.SpatialHashing,
    cellSize: 6
});

const opts = {
    mass: 10,
    speed: 10,
    elasticity: 1,
    angularSpeed: 1,
};

for (let i = 0; i < 100; i++) {
    const circle = new Circle({
        form: { vertices: [new Vector(0, 0)] },
        radius: 10,
        ...opts
    });

    system.addEntity(circle);
}
                `} language="typescript" />
            </p>
        </>
    );
}