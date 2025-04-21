import TreeBuilder from '../../TreeBuilder.js'
import GenealogicalTree from "./GenealogicalTree.js"

export default class FamilyTree {
    constructor(data) {
        this.data = data

        this.elements = {
            'anchor': null,
            'vertices': [],
            'edges': []
        }

        this.build()
        GenealogicalTree.registerTree(this)
    }

    build() {
        const builder = new TreeBuilder(this.data)
        const retrievedObj = builder.createElements()

        this.elements.anchor = retrievedObj['anchor']
        this.elements.vertices = retrievedObj['vertices']
        this.elements.edges = retrievedObj['edges']
    }

    draw(context) {
        /**
         * @type {GraphicalElement[]}
         */
        const elements = [
            this.elements.anchor,
            ...this.elements.vertices,
            ...this.elements.edges
        ]

        elements.forEach(element => {
            element.draw(context)
        })
    }
}