import System from "../System";

import { SystemRenderingConfig } from "../typings/Config";
import { Colors } from "../typings/Enums";
import { ConfigurationError } from "../typings/Error";

/** The class which handles rendering of the system. */
export default class Renderer {
    /** The system the renderer is rendering. */
    public system: System;
    /** The canvas the renderer is rendering on. */
    public canvas!: HTMLCanvasElement;
    /** The context of the canvas. */
    public context!: CanvasRenderingContext2D;
    /** The info for the renderer provided by the client. */
    public rendering!: SystemRenderingConfig;

    /** Data about framerates. */
    public framerate = {
        /** The list of the last 30 framerates. */
        fpsArr: [] as number[],
        /** The average framerate. */
        fps: 0,
        /** The delta between frames. */
        dt: 0,
        /** The last time the framerate was updated. */
        lastUpdate: 0,
    };

    constructor(config: SystemRenderingConfig | undefined, system: System) {
        this.system = system;
        if (!config || !config.canvas) return;

        this.canvas = config.canvas;
        
        const ctx = this.canvas.getContext("2d");
        if (!ctx) throw new ConfigurationError("Could not configure Renderer: Your browser does not support CanvasRenderingContext2D.");
        this.context = ctx;
        
        /** Ensure the canvas stays in bounds. */
        window.addEventListener("resize", () => {
            this.canvas.width = window.innerWidth * window.devicePixelRatio;
            this.canvas.height = window.innerHeight * window.devicePixelRatio;
        });
        window.dispatchEvent(new Event("resize"));

        this.configure(config);
        requestAnimationFrame(this.render.bind(this));
    };

    /** Configures the renderer. */
    public configure(config: SystemRenderingConfig) {
        this.rendering = {
            canvas: this.canvas,
            background: config.background || Colors.White,
            hooks: config.hooks || {},
            gridSize: config.gridSize || 0,
            gridColor: config.gridColor || Colors.Black,
            gridWidth: config.gridWidth || 1,
        };
    };

    /** Renders the system. */
    public render() {        
        /** Update framerate information. */
        this.framerate.dt = performance.now() - this.framerate.lastUpdate;
        this.framerate.lastUpdate = performance.now();

        if (this.framerate.fpsArr.length > 30) this.framerate.fpsArr.shift();
        this.framerate.fpsArr.push(this.framerate.dt);

        let avg = 0;
        for (const fps of this.framerate.fpsArr) avg += fps;
        this.framerate.fps = Math.round(1000 / (avg / this.framerate.fpsArr.length));

        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.context.save();

        /** Render the background, boundaries, and grid. */
        this.context.fillStyle = this.rendering.background!;
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);

        if (this.rendering.gridSize !== 0) {
            this.context.strokeStyle = this.rendering.gridColor!;
            this.context.lineWidth = this.rendering.gridWidth!;

            for (let x = 0; x < this.canvas.width; x += this.rendering.gridSize!) {
                this.context.beginPath();
                this.context.moveTo(x, 0);
                this.context.lineTo(x, this.canvas.height);
                this.context.stroke();
            };

            for (let y = 0; y < this.canvas.height; y += this.rendering.gridSize!) {
                this.context.beginPath();
                this.context.moveTo(0, y);
                this.context.lineTo(this.canvas.width, y);
                this.context.stroke();
            };
        };

        this.context.strokeStyle = this.rendering.gridColor!;

        /** Render the entities. */
        this.context.translate(this.canvas.width / 2, this.canvas.height / 2);
        this.context.scale(this.system.camera.zoom, this.system.camera.zoom);

        this.rendering.hooks!.preRender?.(this.context);

        for (const entity of this.system.entities) {
            if (!entity) continue;

            this.context.save();
            entity.rendering.hooks!.preRender?.(entity, this.context);
            entity.render(this.context);
            entity.rendering.hooks!.postRender?.(entity, this.context);
            this.context.restore();
        };

        this.context.restore();
        this.rendering.hooks!.postRender?.(this.context);
        requestAnimationFrame(this.render.bind(this));
    };
}