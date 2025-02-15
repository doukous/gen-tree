let canvas = document.querySelector('canvas')
let ctx = canvas.getContext("2d")


/**
 * The coordinates of a point
 * 
 * @typedef {object} Coordinate
 * 
 * @property {number | null} x
 * @property {number | null} y
 */

/**
 * The person type, that can be a parent or a children
 * 
 * @typedef {Object} Person
 * 
 * @property {string} firstname
 * @property {string} lastname
 * @property {Coordinate} pos
 */


/**
 * Interface for element that has to be drawn
 * 
 * @interface
 */
class GraphicElement {
    /**
     * The function that draw the element
     * 
     * @returns {void}
     */
    draw() {}
}

/**
 * Represents a family member
 * 
 * @implements GraphicElement
 */
class Box {
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

        this.width = 110
        this.height = 110
    }

    get vertexX() {
        return this.x + this.width / 2
    }
    
    get coordX() {
        return this.x
    }

    get coordY() {
        return this.y
    }

    /**
     * Register a vertex that have a degree to the box
     * @param {Vertex} v - a Vertex to register
     */
    registerVertex(v) {
        this.vertexList.push(v)
    }

    alertVertex() {
        this.vertexList.forEach(v => {
            v.updatePoint(this)
        })
    }

    /**
     * @param {boolean | null} onTop - the boolean for knowing 
     * if the point is on top orbottom  of the box
     */
    getVertexY(onTop) {
        return onTop ? this.y : this.y + this.height
    }

    draw() {
        ctx.strokeRect(this.x, this.y, this.width, this.height)    
    }

    /**
     * The function that react to box move
     * 
     * @param {number} x - the X coordinate
     * @param {number} y - the Y coordinate
     */
    dragAndMove(x, y) {
        this.x = x
        this.y = y
        this.alertVertex()
    }

    checkFocus(mousex, mousey) {
        if (
            mousex >= this.x && mousex <= (this.x + this.width) &&
            mousey >= this.y && mousey <= (this.y + this.height)
        ) {
            this.dragAndMove(mousex - 50, mousey - 50)
        }
    }
}

/**
 * The point that link parents and children
 * 
 * @implements GraphicElement
 */
class Point {
    /**
     * constructor for a family point
     * @param {Array<Person>} parents - the parents lists
     * @param {Array<Person>} kids - the children list
     * @param {number} - parents y coordinate
     */
    constructor(parents, kids) {
        this.parents = parents
        this.kids = kids
    }

    draw() {
        this.parents.forEach(p => {
            const box = new Box(p.pos.x, p.pos.y)
        })
    }
}

/**
 * The link between boxes and a Point
 * 
 * @implements GraphicElement
 */
class Vertex {
    /**
     * A node relying two boxes
     * @param {Box} b - the first box
     * @param {Point} p - the second box
     */
    constructor(b, p) {
        this.box = b
        this.point = p

        this.firstBoxCoord = {
            x : this.box.vertexX,
            y : this.box.getVertexY()
        }

        this.secondBoxCoord = {
            x : this.point.vertexX,
            y : this.point.getVertexY(true)
        }
    }

    updateFirstDegree() {
        this.firstBoxCoord.x = this.box.vertexX
        this.firstBoxCoord.y = this.box.getVertexY()

    }

    updateSecondDegree() {
        this.secondBoxCoord.x = this.point.vertexX
        this.secondBoxCoord.y = this.point.getVertexY(true)

    }

    /**
     * Updates the vertex point on a box moved which fires
     * the function
     * @param {Box} obj - The box that fires the update func
     */
    updatePoint(obj) {
        if (obj === this.box1) {
            this.updateFirstDegree()
        }

        else if (obj === this.point) {
            this.updateSecondDegree()
        }
    }

    draw() {
        ctx.moveTo(this.firstBoxCoord.x, this.firstBoxCoord.y)

        ctx.bezierCurveTo(
            this.firstBoxCoord.x, this.firstBoxCoord.y + 80,
            this.secondBoxCoord.x, this.secondBoxCoord.y - 80,
            this.secondBoxCoord.x, this.secondBoxCoord.y
        )

        ctx.stroke()
    }
}

const b1 = new Box(100, 150)
const b2 = new Box(350, 400)
const b3 = new Box(400, 150)


canvas.addEventListener('pointermove', (e) => {
    if (e.pressure > 0.2) {

        ctx.reset()

        elements.forEach(e => {
            e.draw()
        })
    }
})
