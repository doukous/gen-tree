/** @import {Person, familyData} from "./utils.js" */

import {Point} from "./Point.js"
import {Vertex} from "./Vertex.js"
import {Edge} from "./Edge.js"


function generatePattern(n) {
    const result = [];
    const half = Math.floor(n/2);

    for (let i = -half; i < 0; i++) {
        result.push(i);
    }

    if (n % 2 === 1) {
        result.push(0);
    }

    for (let i = 1; i <= half; i++) {
        result.push(i);
    }

    return result;
}

export default class TreeBuilder {
    /**
     * @param {familyData} data
     */
    constructor(data) {
        this.parents = data.payload.parents
        this.children = data.payload.children

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
            - this.vertexConfig.defaultHeight - 100,
            this.father.firstname
        )

        this.motherObj = new Vertex(
            this.anchorPoint.x + this.anchorPoint.radius
            + this.vertexConfig.defaultWidth - 50,
            this.anchorPoint.y - this.anchorPoint.radius
            - this.vertexConfig.defaultHeight - 100,
            this.mother.firstname
        )
    }

    createChildren() {
        this.childrenObj = []

        const childrenNumber = this.children.length
        const coefficients = generatePattern(childrenNumber)

        for (let i = 0; i < childrenNumber; i++) {
            let specificCoordinateXValue = 0

            const multiplier = coefficients[i]

            if (multiplier < 0) {
                specificCoordinateXValue = multiplier *
                    (this.anchorPoint.radius + this.vertexConfig.defaultWidth + 80)
            }

            else if (multiplier === 0) {
                specificCoordinateXValue = - 50
            }

            else {
                specificCoordinateXValue = multiplier *
                    (this.anchorPoint.radius + this.vertexConfig.defaultWidth + 20)
            }

            const childObj = new Vertex(
                this.anchorPoint.x + specificCoordinateXValue,
                this.anchorPoint.y + this.anchorPoint.radius
                + this.vertexConfig.defaultHeight + 100,
                this.children[i].firstname
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