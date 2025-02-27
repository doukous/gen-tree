/**
 * @import {InteractiveElement} from "./InteractiveELement.js"
 *
 * @implements{InteractiveElement}
 *
 * Represents a family member
 */
export class Vertex {
    /**
     * @type {Array<Vertex>} - the list of vertices
     *                         triggered by checkPosition function
     */
    static vertices = []

    /**
     * The Vertex constructor
     * 
     * @param {number} x - the X coordinate
     * @param {number} y - the Y coordinate
     */
    constructor(x, y) {
        this.x = x
        this.y = y
        this.z = 0

        /**
         * @type {Array<Edge>} - The array of vertex linked to box
         */
        this.edgesList = []

        this.width = 100
        this.height = 80

        Vertex.vertices.push(this)
    }

    /**
     * @type {Vertex | null}
     */
    static draggedVertex = null

    get EdgeCoordX() {
        return this.x + (this.width / 2)
    }

    getEdgeCoordY(onTop = false) {
        return onTop ? this.y : this.y + this.height
    }

    registerEdge(v) {
        this.edgesList.push(v)
    }

    alertEdge() {
        this.edgesList.forEach((v) => {
            v.updateCoordinate(this)
        })
    }
    
    draw(ctx) {
        ctx.strokeRect(this.x, this.y, this.width, this.height)    
    }
    
    /**
     * The function that react to box move
     * 
     * @param {number} x - the X coordinate
     * @param {number} y - the Y coordinate
     */
    static updateCoordinate(x, y) {
        Vertex.draggedVertex.x = x
        Vertex.draggedVertex.y = y


        Vertex.draggedVertex.alertEdge()
    }

    static handleRelease() {
        Vertex.firedVertices = []
        Vertex.draggedVertex = null
    }

    set setZValue(value) {
        this.z = value
    }

    static firedVertices = []

    static checkPosition(mouseX, mouseY) {
        for (let el of Vertex.vertices) {
            if (
                mouseX >= el.x && mouseX <= (el.x + el.width) &&
                mouseY >= el.y && mouseY <= (el.y + el.height)
            ) {
                if (!Vertex.firedVertices.includes(el)) {
                    Vertex.firedVertices.push(el)
                }
            }

            else {
                if (Vertex.firedVertices.includes(el)) {
                    const index = Vertex.firedVertices.indexOf(el)
                    Vertex.firedVertices.splice(index, 1)
                }
            }
        }

        if (Vertex.firedVertices.length === 1) {
            Vertex.draggedVertex = Vertex.firedVertices[0]
            Vertex.draggedVertex.z = 0
        }

        else if (Vertex.firedVertices.length > 1 && Vertex.draggedVertex === null) {
            const topValue = [Vertex.firedVertices[0].z, Vertex.firedVertices[0]]

            for (let el of Vertex.firedVertices) {
                if (el.z > topValue[0]) {
                    topValue[0] = el.z
                    topValue[1] = el
                }
            }

            Vertex.draggedVertex = topValue[1]
        }

        else if (Vertex.firedVertices.length > 1 && Vertex.draggedVertex !== null) {
            const topValue = [Vertex.firedVertices[0].z, Vertex.firedVertices[0]]

            for (let el of Vertex.firedVertices) {
                if (el.z > topValue[0]) {
                    topValue[0] = el.z
                    topValue[1] = el
                }
            }

            if (
                Vertex.draggedVertex === topValue[1] &&
                topValue[0] === 0
            ) {
                this.draggedVertex.z = 1
            }

            else if (Vertex.draggedVertex !== topValue[1]) {
                this.draggedVertex.z = topValue[0] + 1
            }
        }

        Vertex.updateCoordinate(mouseX - 40, mouseY - 40)
    }
}
