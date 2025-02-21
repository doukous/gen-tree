import { Vertex } from './Vertex.js'
import { Point } from './Point.js'
import { Edge} from "./Edge.js";


const canvas = document.querySelector('canvas')

const f = new Vertex(150, 50)
const m = new Vertex(350, 50)

const s1 = new Vertex(50, 400)
const s2 = new Vertex(250, 400)
const s3 = new Vertex(450, 400)

const p = new Point(300, 250)

const v1 = new Edge(f, p, true)
const v2 = new Edge(m, p, true)

const v3 = new Edge(s1, p)
const v4 = new Edge(s2, p)
const v5 = new Edge(s3, p)

const elementList = [f, m, p, s1, s2, s3]
const vertexList = [v1, v2, v3, v4, v5]
const  allElements = [...elementList, ...vertexList]

if (canvas) {
    const ctx = canvas.getContext("2d")

    for (let e of allElements) {
        e.draw(ctx)
    }

    canvas.addEventListener('pointermove', (e) => {
        if (e.pressure > 0.2) {
            elementList.forEach((el) => {
                el.checkPosition(e.offsetX, e.offsetY)
            })

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            allElements.forEach((el) => {
                el.draw(ctx)
            })
        }
    })
}
