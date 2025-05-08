/** @import {Vertex} from "./Vertex.js" */
import {GraphicalElement} from "./GraphicalElement.js"

/**
 * The point that link parents and children
 */
export class Point extends GraphicalElement {
    /**
     * Constructor for a family point
     * 
     * @param {number} x - the X coordinate
     * @param {number} y - the Y coordinate
     * 
     */
    constructor(x, y) {
        super()

        /** @type {Array<Vertex>} - a list of vertexConfig linked to the point */
        this.LinkedVertex = []

        this._x = x
        this._y = y

        this.radius = 10
    }

    get x() {
        return this._x
    }

    get y() {
        return this._y
    }

    getY(onTop = false) {
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