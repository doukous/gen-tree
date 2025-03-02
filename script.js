import {data} from "./data.js"
import FamilyTree from "./FamilyTree.js"
import {GenealogicalTree} from "./GenealogicalTree.js";


const canvas = document.querySelector('canvas')

const a = new GenealogicalTree(canvas)
const familyTree = new FamilyTree(data)

GenealogicalTree.draw()