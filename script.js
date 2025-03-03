import {data} from "./data.js"
import FamilyTree from "./FamilyTree.js"
import {GenealogicalTree} from "./GenealogicalTree.js"
import {Vertex} from "./Vertex.js"


const canvas = document.querySelector('canvas')
//
// const bPlusEl = document.getElementById('b-plus')
// const bMinusEl = document.getElementById('b-minus')
//
// bPlusEl.addEventListener('click', () => {
//     console.log('bouton plus')
// })
//
// bMinusEl.addEventListener('click', () => {
//     console.log('bouton moins')
// })

// new GenealogicalTree(canvas)
// new FamilyTree(data)
//
// GenealogicalTree.draw()

const [x, y] = [300, 200]
const [sx, sy] = [3, 2]
const [w, h] = [100, 100]


const ctx = canvas.getContext('2d')

const a = new Vertex(x, y, w, h)
// const b = new Vertex(x * 1.5, y, 50, 50)

a.draw(ctx)
// b.draw(ctx)

ctx.translate(-(sx - 1) * x - (w * (sx - 1)/2), - (sy - 1) * y - (h * (sy - 1)/2))
ctx.scale(sx, sy)

const c = new Vertex(x, y, w, h)
c.draw(ctx)