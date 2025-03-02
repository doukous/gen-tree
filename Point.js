import {GraphicalElement} from "./GraphicalElement.js";

/**
 * The point that link parents and children
 */
export class Point extends GraphicalElement {
    /**
     * Constructor for a family point
     * 
     * @param {number} x - the X coordinate
     * @param {number} y - the Y coordinate
     */
    constructor(x, y) {
        super()

        /**
         * @type {Array<Vertex>} - a list of vertexConfig linked to the point
         */
        this.LinkedVertex = []

        this.x = x
        this.y = y

        this.radius = 10
    }

    get EdgeCoordX() {
        return this.x
    }

    getEdgeCoordY(onTop = false) {
        return onTop ? (this.y - this.radius) : (this.y + this.radius)
    }

    registerEdge(v) {
        this.LinkedVertex.push(v)
    }

    draw(ctx) {
        ctx.beginPath()
        ctx.arc(
            this.x, this.y,
            this.radius, 0,
            Math.PI * 2
        )

        ctx.stroke()
    }
}