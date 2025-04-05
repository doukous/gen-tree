import {familyDataSample} from "./dataSample.js"
import FamilyTree from "./FamilyTree.js"
import GenealogicalTree from "./GenealogicalTree.js"
import {monitorInteraction} from "./Interactions.js"

const canvas = document.querySelector('canvas')

new GenealogicalTree(canvas)
new FamilyTree(familyDataSample)

GenealogicalTree.draw()
monitorInteraction()
