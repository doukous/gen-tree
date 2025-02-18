/**
 * The point that link parents and children
 * @import {Person, InteractiveElement} from "./InteractiveELement.js"
 * 
 * @implements {InteractiveElement}
 */
export class Point {
    /**
     * Constructor for a family point
     * 
     * @param {number} x - the X coordinate
     * @param {number} y - the Y coordinate
     */
    constructor(x, y) {
        /**
         * @type {Array<Vertex>} - a list of vertex linked to the point
         */
        this.LinkedVertex = []

        this.x = x
        this.y = y

        this.radius = 15
    }

    get vertexX() {
        return this.x
    }

    getVertexY(onTop = false) {
        return onTop ? (this.y - this.radius) : (this.y + this.radius)
    }

    registerVertex(v) {
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

    alertVertex() {
        this.LinkedVertex.forEach((vertex) => {
            vertex.updateCoordinate(this)
        })
    }

    updateCoordinate(x, y) {
        this.x = x
        this.y = y

        this.alertVertex()
    }

    checkPosition(mousex, mousey) {
        const xDiff = Math.pow((mousex - this.x), 2)
        const yDiff = Math.pow((mousey - this.y), 2)

        const mousePositionRadius = Math.sqrt(xDiff + yDiff)

        if (mousePositionRadius <= this.radius) {
            this.updateCoordinate(mousex, mousey)
        }
    }
}