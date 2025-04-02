/** @import {Person} from "./utils.js" */

import {Point} from "./Point.js"
import {Vertex} from "./Vertex.js"
import {Edge} from "./Edge.js"

/**
 * @typedef {object} isDisplayed
 * @property {boolean} isDisplayed
 */

/**
 * @typedef {Person & isDisplayed} requestEmitter
 */

/**
 * @typedef {object} serverResponse
 *
 * @property {requestEmitter} requestSource
 * @property {Array<Person>} parents
 * @property {Array<Person>}  children
 */

function generatePattern(n) {
    const result = [];
    const half = Math.floor(n/2);

    // Generate negative side
    for (let i = -half; i < 0; i++) {
        result.push(i);
    }

    // Add 0 for odd n
    if (n % 2 === 1) {
        result.push(0);
    }

    // Generate positive side
    for (let i = 1; i <= half; i++) {
        result.push(i);
    }

    return result;
}

export default class TreeBuilder {
    /**
     * @param {serverResponse} data
     */
    constructor(data) {
        this.requestSource = data.requestSource
        this.parents = data.parents
        this.children = data.children

        this.treeElements = {
            'anchor' : null,
            'vertices' : [],
            'edges' : []
        }

        this.canvas = {
          width: document.querySelector('canvas').width,
          height: document.querySelector('canvas').height,
        }

        this.vertexConfig = {
            defaultWidth: 100,
            defaultHeight: 80,
        }
    }

    createElements() {
        this.createAnchorPoint()
        this.treeElements.anchor = this.anchorPoint

        if (this.requestSource.role !== 'child') {
            this.parents.push(this.requestSource)
        }

        else {
            this.children.push(this.requestSource)
        }

        this.createParents()
        this.createChildren()

        this.treeElements['vertices'].push(
            this.fatherObj, this.motherObj,
            ...this.childrenObj
        )

        this.createEdges()
        this.treeElements['edges'].push(...this.edgesObj)

        return this.treeElements
    }

    createAnchorPoint() {
        this.anchorPoint = new Point(
            this.canvas.width / 2,
            this.canvas.height / 2
        )
    }

    createParents() {
        this.father = this.parents.find(el => el.role === 'father')
        this.mother = this.parents.find(el => el.role === 'mother')

        this.fatherObj = new Vertex(
            this.anchorPoint.x - this.anchorPoint.radius
            - this.vertexConfig.defaultWidth - 50,
            this.anchorPoint.y - this.anchorPoint.radius
            - this.vertexConfig.defaultHeight - 100
        )

        this.motherObj = new Vertex(
            this.anchorPoint.x + this.anchorPoint.radius
            + this.vertexConfig.defaultWidth - 50,
            this.anchorPoint.y - this.anchorPoint.radius
            - this.vertexConfig.defaultHeight - 100
        )
    }

    createChildren() {
        this.childrenObj = []

        const childrenNumber = this.children.length
        const coefficients = generatePattern(childrenNumber)

        for (let i = 0; i < childrenNumber; i++) {
            let specificPositionValue = 0

            const multiplier = coefficients[i]

            if (multiplier < 0) {
                specificPositionValue = multiplier *
                    (this.anchorPoint.radius + this.vertexConfig.defaultWidth + 20)
            }

            else if (multiplier === 0) {
                specificPositionValue = - 50
            }

            else {
                specificPositionValue = multiplier *
                    (this.anchorPoint.radius + this.vertexConfig.defaultWidth + 20)
            }

            const childObj = new Vertex(
                this.anchorPoint.x + specificPositionValue,
                this.anchorPoint.y + this.anchorPoint.radius
                + this.vertexConfig.defaultHeight + 100
            )

            this.childrenObj.push(childObj)
        }
    }

    createEdges() {
        this.edgesObj = []

        const fatherEdge = new Edge(this.fatherObj, this.anchorPoint, true)
        const motherEdge = new Edge(this.motherObj, this.anchorPoint, true)

        this.edgesObj.push(fatherEdge, motherEdge)

        this.childrenObj.forEach((child) => {
            const edge = new Edge(child, this.anchorPoint, false)
            this.edgesObj.push(edge)
        })
    }
}