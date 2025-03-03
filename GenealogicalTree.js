import {Vertex} from "./Vertex.js"

export class GenealogicalTree {
    static existingTree = null
    static subtreesList = []
    static context = null

    constructor(canvas) {
        if (GenealogicalTree.existingTree !== null) {
            return GenealogicalTree.existingTree
        }

        this.canvas = canvas

        GenealogicalTree.existingTree = this
        this.initContext(this.canvas)
        this.monitorCanvas()
    }

    monitorCanvas() {
        this.canvas.addEventListener('pointermove', (e) => {
            if (e.pressure > 0.2) {
                Vertex.checkPosition(e.offsetX, e.offsetY)
                GenealogicalTree.context.reset()
                GenealogicalTree.draw()
            }
        })

        this.canvas.addEventListener('pointerup', () => {
            Vertex.handleRelease()
        })
    }

    initContext(canvas) {
        GenealogicalTree.context = canvas.getContext("2d")
    }

    static draw() {
        for (let el of GenealogicalTree.subtreesList) {
            el.draw(GenealogicalTree.context)
        }
    }

    static registerTree(tree) {
        GenealogicalTree.subtreesList.push(tree)
    }
}