import { Colors } from "./Enums";

import Entity from "../entities/Entity";
import Vector, { VectorLike } from "../utils/Vector";

/** The configuration for the camera. */
export interface CameraConfig {
    /** The position of the camera. Defaults to `{ x: 0, y: 0 }`. */
    position?: VectorLike;
    /** The measure of how zoomed in the camera is. Defaults to `1`. */
    zoom?: number;
};

/** The configuration for rendering. */
export interface SystemRenderingConfig {
    /** The canvas to draw on. */
    canvas: HTMLCanvasElement;
    /** The background color of the system. Defaults to `Colors.White`. */
    background?: Colors | string;
    /** The color of the grid. Defaults to `Colors.Black`. */
    gridColor?: Colors | string;
    /** The length of one side of the grid squares. If not provided, a grid will not be drawn. */
    gridSize?: number;
    /** The width of the gridlines. Defaults to `1`. */
    gridWidth?: number;
    /** The hooks into the renderer. */
    hooks?: {
        /** The hooks to run before rendering. */
        preRender?: (context: CanvasRenderingContext2D) => void;
        /** The hooks to run after rendering. */
        postRender?: (context: CanvasRenderingContext2D) => void;
    };
};

/** The interface for rendering an entity. */
export interface EntityRenderingConfig {
    /** The stroke color of the entity. If not specified, the entity will not be stroked. If neither fillColor nor strokeColor is specified, the entity will be stroked by `Colors.Black` */
    strokeColor?: Colors | string;
    /** The fill color of the entity. If not specified, the entity will not be filled. If neither fillColor nor strokeColor is specified, the entity will be stroked by `Colors.Black`. */
    fillColor?: Colors | string;
    /** The width of the stroke. Defaults to `1`. */
    strokeWidth?: number;
    /** The glow intensity of the entity. If not specified, the entity will not have a glow. */
    glowIntensity?: number;
    /** The glow color of the entity. If not specified, the entity will have the same glow as its stroke. */
    glowColor?: Colors | string;
    /** The hooks into the renderer. */
    hooks?: {
        /** The hooks to run before rendering the entity. */
        preRender?: (entity: Entity, context: CanvasRenderingContext2D) => void;
        /** The hooks to run after rendering the entity. */
        postRender?: (entity: Entity, context: CanvasRenderingContext2D) => void;
    };
};

/** The valid properties of the configuration of the system. */
export interface SystemConfig {    
    collisionInfo: {
        /** The cell size of the collision engine (only applicable to hashgrids), which represents `2 ** x` game units. Default is `12`. */
        cellSize?: number;
    };

    /** The dimensions of the system. */
    dimensions?: VectorLike;

    /** The rate at which entities update (in FPS/Hz). Default is `60Hz`. */
    tickRate?: number;
    /** Whether or not verbose logs (such as warnings) should be logged. Default is `false`. */
    verbose?: boolean;
    /** Whether or not the system should use `requestAnimationFrame` over `setInterval`. Defaults to `true`. */
    useRAF?: boolean;
    
    /** The friction of the system when moving. Default is `0.1`. */
    friction?: number;
    /** The gravity of the system when moving. Default is `0`. */
    gravity?: number;

    /** The configuration of the camera. */
    camera?: CameraConfig;

    /** Rendering options for the system. */
    render?: SystemRenderingConfig;
};