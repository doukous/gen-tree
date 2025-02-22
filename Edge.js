/** @import {Coordinate} from "./InteractiveELement.js" */


/**
 * The link between boxes and a Point
 */
export class Edge {
    /**
     * A node linking two boxes
     * @param {Box} b - the first box
     * @param {Point} p - the second box
     * @param {boolean} isp - whether to use parent config
     */
    constructor(b, p, isp = false) {
        this.box = b
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

        this.box.registerEdge(this)
        this.point.registerEdge(this)
    }

    firstDegree() {
        const x = this.box.EdgeCoordX

        const y = this.isParent ?
                this.box.getEdgeCoordY() : this.box.getEdgeCoordY(true)

        return {x, y}
    }

    secondDegree() {
        const x = this.point.EdgeCoordX

        const y = this.isParent ?
                this.point.getEdgeCoordY(true) : this.point.getEdgeCoordY()

        return {x, y}
    }

    updateCoordinate(element) {
        console.log("updateCoordinate", element)
        if (element === this.box) {
            this.firstCoordinate = this.firstDegree()
        }

        else if (element === this.point) {
            this.secondCoordinate = this.secondDegree()
        }
    }

    draw(ctx) {
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