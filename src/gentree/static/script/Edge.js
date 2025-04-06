import {GraphicalElement} from "./GraphicalElement.js"

/**
 * The link between boxes and a Point
 */
export class Edge extends GraphicalElement {
    /**
     * A node linking two boxes
     * @param {Vertex} v - the first box
     * @param {Point} p - the second box
     * @param {boolean} isp - whether to use parent config
     */
    constructor(v, p, isp = false) {
        super()
        this.vertex = v
        this.point = p
        this.isParent = isp

        /**
         * @type {Coordinate}
         */
        this.firstCoordinate = this.firstDegree()

        /**
         * @type {Coordinate}
         */
        this.secondCoordinate = this.secondDegree()

        this.vertex.registerEdge(this)
        this.point.registerEdge(this)
    }

    firstDegree() {
        const x = this.vertex.EdgeX

        const y = this.isParent ?
                this.vertex.getEdgeY() : this.vertex.getEdgeY(true)

        return {x, y}
    }

    secondDegree() {
        const x = this.point.x

        const y = this.isParent ?
                this.point.getY(true) : this.point.getY()

        return {x, y}
    }

    updateCoordinate(element) {
        if (element === this.vertex) {
            this.firstCoordinate = this.firstDegree()
        }

        else if (element === this.point) {
            this.secondCoordinate = this.secondDegree()
        }
    }

    draw(ctx) {
        super.draw(ctx)

        ctx.beginPath()
        ctx.moveTo(this.firstCoordinate.x, this.firstCoordinate.y)

        if (this.isParent) {
            ctx.bezierCurveTo(
                this.firstCoordinate.x, this.firstCoordinate.y + 60,
                this.secondCoordinate.x, this.secondCoordinate.y - 60,
                this.secondCoordinate.x, this.secondCoordinate.y
            )
        }

        else {
            ctx.bezierCurveTo(
                this.firstCoordinate.x, this.firstCoordinate.y - 60,
                this.secondCoordinate.x, this.secondCoordinate.y + 60,
                this.secondCoordinate.x, this.secondCoordinate.y
            )
        }

        ctx.stroke()
    }
}