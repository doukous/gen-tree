/** @import {Family} from "../../types.js" */
import {Point} from "../figures/Point.js"
import {Vertex} from "../figures/Vertex.js"
import {Edge} from "../figures/Edge.js"


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

function* infinite() {
    let index = 0
  
    while (true) {
      yield index += 500
    }
  }

export default class TreeBuilder {
    /** @type {Map<string, Vertex>} */
    static allVertices = new Map()

    static gen = infinite()

    constructor() {
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

    /** @param {Family} data */
    createElements(data) {
        /** @type {Array<Person>} */
        this.parents = data.payload.parents
        /** @type {Array<Person>} */
        this.children = data.payload.children
        
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
        const base = TreeBuilder.gen.next().value

        this.anchorPoint = new Point(
            this.canvas.width / 2,
            this.canvas.height / 2  + base
        )
    }

    createParents() {
        this.father = this.parents.find(el => el.sex === 'male')
        this.mother = this.parents.find(el => el.sex === 'female')

        if (TreeBuilder.allVertices.has(this.father.uid)) {
            this.fatherObj = TreeBuilder.allVertices.get(this.father.uid)
        }

        else {
            this.fatherObj = new Vertex(
                this.anchorPoint.x - this.anchorPoint.radius
                - this.vertexConfig.defaultWidth - 50,
                this.anchorPoint.y - this.anchorPoint.radius
                - this.vertexConfig.defaultHeight - 100,
                this.father.firstname
            )

            TreeBuilder.allVertices.set(this.father.uid, this.fatherObj)
        }


        if (TreeBuilder.allVertices.has(this.mother.uid)) {
            this.motherObj = TreeBuilder.allVertices.get(this.mother.uid)
        }

        else {
            this.motherObj = new Vertex(
                this.anchorPoint.x + this.anchorPoint.radius
                + this.vertexConfig.defaultWidth - 50,
                this.anchorPoint.y - this.anchorPoint.radius
                - this.vertexConfig.defaultHeight - 100,
                this.mother.firstname
            )
    
            TreeBuilder.allVertices.set(this.mother.uid, this.motherObj)    
        }
    }

    createChildren() {
        this.childrenObj = []

        const childrenNumber = this.children.length
        const coefficients = generatePattern(childrenNumber)

        for (let i = 0; i < childrenNumber; i++) {
            if (TreeBuilder.allVertices.has(this.children[i].uid)) {
                this.childrenObj.push(
                    TreeBuilder.allVertices.get(
                        this.children[i].uid
                    )
                )

                continue
            }

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
            TreeBuilder.allVertices.set(this.children[i].uid, childObj)
        }
    }

    createEdges() {
        this.edgesObj = []

        const fatherEdge = new Edge(this.fatherObj, this.anchorPoint, true)
        const motherEdge = new Edge(this.motherObj, this.anchorPoint, true)

        this.edgesObj.push(fatherEdge, motherEdge)

        this.childrenObj.forEach(
            (child) => {
            const edge = new Edge(child, this.anchorPoint, false)
            this.edgesObj.push(edge)
        })
    }
}