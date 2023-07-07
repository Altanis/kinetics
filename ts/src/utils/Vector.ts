export interface VectorLike {
    x: number;
    y: number;
}

/** A vector in 2D space, represents a direction and magnitude simultaneously. */
export default class Vector implements VectorLike {
    /** The coordinates of the vector. */
    public x = 0;
    public y = 0;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    /** Converts polar coordinates to Cartesian coordinates. */
    public static toCartesian(r: number, theta: number): Vector {
        return new Vector(r * Math.cos(theta), r * Math.sin(theta));
    }

    /** Adds to a vector. */
    public add(vector: VectorLike): Vector {
        this.x += vector.x;
        this.y += vector.y;
    
        return this;
    }

    /** Subtracts from a vector. */
    public subtract(vector: VectorLike): Vector {
        this.x -= vector.x;
        this.y -= vector.y;

        return this;
    }

    /** Scales from a vector. */
    public scale(scalar: number): Vector {
        this.x *= scalar;
        this.y *= scalar;

        return this;
    }

    /** Normalizes the vector. */
    public normalize() {
        const magnitude = this.magnitude;

        if (magnitude === 0) this.x = this.y = 0;
        else {
            this.x /= magnitude;
            this.y /= magnitude;
        }

        return this;
    }

    /** Gets the distance from another vector. */
    public distance(vector: VectorLike): number {
        return this.clone.subtract(vector).magnitude;
    }

    /** Gets the dot product of two vectors. */
    public dot(vector: VectorLike): number {
        return this.x * vector.x + this.y * vector.y;
    }

    /** Gets the cross product of two vectors. */
    public cross(vector: VectorLike): number {
        return this.x * vector.y - this.y * vector.x;
    }

    /** Gets the projection of the current vector onto another vector. */
    public project(vector: Vector): Vector {
        if (vector.x === 0 && vector.y === 0) return new Vector(0, 0);
        return vector.clone.scale(this.dot(vector) / vector.magnitudeSq);
    };

    /** Creates a vector directionally orthogonal to the current vector. */
    public get orthogonal(): Vector {
        return new Vector(-this.y, this.x);
    }

    /** Gets the angle of the vector from a reference point. */
    public angle(reference = { x: 0, y: 0 }): number {
        return Math.atan2(this.y - reference.y, this.x - reference.x);
    }

    /** Rotates the angle to a new angle. */
    public rotate(angle: number) {
        const magnitude = this.magnitude;

        this.x = magnitude * Math.cos(angle);
        this.y = magnitude * Math.sin(angle);

        return this;
    }
    
    /** Gets the magnitude (length) of the vector. */
    public get magnitude(): number {
        return Math.sqrt(this.magnitudeSq);
    };

    /** Sets the magnitude (length) of the vector. */
    public set magnitude(magnitude: number) {
        const angle = this.angle();

        this.x = magnitude * Math.cos(angle);
        this.y = magnitude * Math.sin(angle);
    };

    /** Gets the squared magnitude of the vector. */
    public get magnitudeSq(): number {
        return this.x * this.x + this.y * this.y;
    };

    /** Clones the vector. */
    public get clone(): Vector {
        return new Vector(this.x, this.y);
    }
};
