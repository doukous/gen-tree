/**
 * Represents a family member
 * 
 * @implements {InteractiveElement}
 */
export class Box {
    /**
     * The Box constructor
     * 
     * @param {number} x - the X coordinate
     * @param {number} y - the Y coordinate
     */
    constructor(x, y) {
        this.x = x
        this.y = y

        /**
         * @type {Array<Vertex>} - The array of vertex linked to box
         */
        this.vertexList = []

        this.width = 100
        this.height = 80
    }

    get vertexX() {
        return this.x + (this.width / 2)
    }

    getVertexY(onTop = false) {
        return onTop ? this.y : this.y + this.height
    }

    registerVertex(v) {
        this.vertexList.push(v)
    }

    alertVertex() {
        this.vertexList.forEach((v) => {
            
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
    }

    checkPosition(mousex, mousey) {
        if (
            mousex >= this.x && mousex <= (this.x + this.width) &&
            mousey >= this.y && mousey <= (this.y + this.height)
        ) {
            this.updateCoordinate(mousex - 50, mousey - 50)
        }
    }
}
