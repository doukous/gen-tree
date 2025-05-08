/** @import {FamilyElements} from "../../types.js" */
import TreeBuilder from "./TreeBuilder.js"
import GenealogicalTree from "./GenealogicalTree.js"

export default class FamilyTree {
    constructor() {
        /** @type {FamilyElements} */
        this.elements = {
            'anchor': null,
            'vertices': [],
            'edges': []
        }

        this.reliedTo = {
            family: null,
            member: null
        }

        this.builder = new TreeBuilder()
    }

    build(data) {
        this.data = data
        const retrievedObj = this.builder.createElements(this.data)

        this.elements.anchor = retrievedObj['anchor']
        this.elements.vertices = retrievedObj['vertices']
        this.elements.edges = retrievedObj['edges']

        GenealogicalTree.registerTree(this)
    }

    reset() {
        this.elements.vertices.forEach(
            el => el.reset()
        )
    }

    draw(context) {
        this.elements.vertices.forEach(
            vertex => {
                if (! vertex.rendered) {
                    vertex.draw(context)
                }
            }
        )
        
        const otherElements = [
            this.elements.anchor,
            ...this.elements.edges
        ]

        otherElements.forEach(element => {
            element.draw(context)
        })
    }
}