import {data} from "./data.js"
import FamilyTree from "./FamilyTree.js"
import GenealogicalTree from "./GenealogicalTree.js"
import {monitorInteraction} from "./Interactions.js"

const canvas = document.querySelector('canvas')

new GenealogicalTree(canvas)
new FamilyTree(data)

GenealogicalTree.draw()
monitorInteraction()
