import FamilyTree from "./canvas/trees/FamilyTree.js"
import GenealogicalTree from "./canvas/trees/GenealogicalTree.js"
import { monitorInteraction } from "./Interactions.js"

const canvas = document.querySelector('canvas')
new GenealogicalTree(canvas)

const url = new URL("api/families", "http://127.0.0.1:8000")
const req = new Request(url)
const f = new FamilyTree()

async function displayTree() {
    try {
        const response = await fetch(req)
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`)
        }
  
        const data = await response.json()

        // f.build(data[0])

        for (const d of data) {
            f.build(d)
        }

        GenealogicalTree.draw()
        monitorInteraction()
    } 
    
    catch (error) {
        console.error(error.message)
    }
}

displayTree()