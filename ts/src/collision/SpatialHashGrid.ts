import System from "../System";

import { ConfigurationError } from "../typings/Error";
import { CollisionManager } from "../typings/Interfaces";

const hash = (x: number, y: number) => x + y * 0xB504;

/** A binary space partitioning system which splits the arena into square cells.  */
export default class SpatialHashGrid implements CollisionManager {
    public cells: Map<number, number[]> = new Map();
    public system: System;
    public cellSize: number;

    constructor(system: System, cellSize: number) {
        if (!Number.isInteger(cellSize) || cellSize >= 32)
            throw new ConfigurationError("Could not initialize SpatialHashGrid: Cell size must be an integer value less than 32.");

        this.system = system;
        this.cellSize = cellSize;
    }

    /** Inserts an entity into the grid. */
    public insert(x: number, y: number, w: number, h: number, id: number) {
        const startX = x >> this.cellSize;
        const startY = y >> this.cellSize;
        const endX = (x + w) >> this.cellSize;
        const endY = (y + h) >> this.cellSize;

        for (let x = startX; x <= endX; x++) {
            for (let y = startY; y <= endY; y++) {
                const key = hash(x, y);

                if (!this.cells.get(key)) this.cells.set(key, []);
                this.cells.get(key)!.push(id);
            }
        }
    }

    /* Queries the grid by iterating over every cell and performing narrowphase detection on each entity. */
    public query() {      
        // iterate over each map
        this.cells.forEach(cell => {
            const length = cell.length;
            if (length < 2) return;

            for (let i = 0; i < length; i++) {
                for (let j = i + 1; j < length; j++) {
                    /** @ts-ignore */
                    const entity1 = this.system.entities[cell[i]]!;
                    /** @ts-ignore */
                    const entity2 = this.system.entities[cell[j]]!;

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
    public clear() {
        this.cells.clear();
    };

    // public query() {
    //     console.time();
    //     for (let i = this.hashBucketSize; i--;) {
    //         const cell = this.cells[i];

    //         const length = cell.length;

    //         for (let j = 0; j < length; j++) {
    //             for (let k = j + 1; k < length; k++) {
    //                 const id1 = cell[j];
    //                 const id2 = cell[k];
                    
    //                 const entity1 = id1 > id2 ? this.system.entities[id1]! : this.system.entities[id2]!;
    //                 const entity2 = id1 > id2 ? this.system.entities[id2]! : this.system.entities[id1]!;

    //                 this.system.CollisionResolver.detect(entity1, entity2);
    //             }
    //         }
    //     }
    //     console.timeEnd();
    // };

    // public clear() {
    //     for (let i = this.hashBucketSize; i--;) {
    //         this.cells[i].length = 0;
    //     }
    // }
};