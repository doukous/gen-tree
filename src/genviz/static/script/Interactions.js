import {Vertex} from "./canvas/figures/Vertex.js";
import GenealogicalTree from "./canvas/trees/GenealogicalTree.js";


function getAdjustedMouseCoordinates(mouseX, mouseY) {
    const adjustedX = (mouseX - GenealogicalTree.panOffset.x  + GenealogicalTree.scaledOffset.x) / GenealogicalTree.scale
    const adjustedY = (mouseY - GenealogicalTree.panOffset.y  + GenealogicalTree.scaledOffset.y) / GenealogicalTree.scale

    return [adjustedX, adjustedY]
}

export function monitorInteraction() {
    GenealogicalTree.canvas.addEventListener('pointermove', (e) => {
        if (e.pressure > 0.2) {
            const [adjustedX, adjustedY] = getAdjustedMouseCoordinates(e.offsetX, e.offsetY)
            Vertex.checkPosition(adjustedX, adjustedY)
            GenealogicalTree.handlePanMoves(adjustedX, adjustedY)
        }
    })

    GenealogicalTree.canvas.addEventListener('pointerdown', (e) => {
        const [adjustedX, adjustedY] = getAdjustedMouseCoordinates(e.offsetX, e.offsetY)
        GenealogicalTree.baseOffset = {x: adjustedX, y: adjustedY}
    })

    GenealogicalTree.canvas.addEventListener('pointerup', (e) => {
        const [adjustedX, adjustedY] = getAdjustedMouseCoordinates(e.offsetX, e.offsetY)

        Vertex.handleRelease()
        GenealogicalTree.handleRelease(adjustedX, adjustedY)
    })
}
