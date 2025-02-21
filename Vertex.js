/**
 * Represents a family member
 * 
 * @implements {InteractiveElement}
 */
export class Vertex {
    /**
     * The Vertex constructor
     * 
     * @param {number} x - the X coordinate
     * @param {number} y - the Y coordinate
     */
    constructor(x, y) {
        this.x = x
        this.y = y

        /**
         * @type {Array<Edge>} - The array of vertex linked to box
         */
        this.vertexList = []

        this.width = 100
        this.height = 80
    }

    get EdgeCoordX() {
        return this.x + (this.width / 2)
    }

    getEdgeCoordY(onTop = false) {
        return onTop ? this.y : this.y + this.height
    }

    registerEdge(v) {
        this.vertexList.push(v)
    }

    alertEdge() {
        this.vertexList.forEach((v) => {
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
    updateCoordinate(x, y) {
        this.x = x
        this.y = y

        this.alertEdge()
    }

    checkPosition(mousex, mousey) {
        if (
            mousex >= this.x && mousex <= (this.x + this.width) &&
            mousey >= this.y && mousey <= (this.y + this.height)
        ) {
            this.updateCoordinate(mousex - 40, mousey - 40)
        }
    }
}
