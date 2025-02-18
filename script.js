import { Box } from './Box.js'
import { Point } from './Point.js'
import { Vertex} from "./Vertex.js";


const canvas = document.querySelector('canvas')

const f = new Box(150, 50)
const m = new Box(350, 50)

const s1 = new Box(50, 400)
const s2 = new Box(250, 400)
const s3 = new Box(450, 400)

const p = new Point(300, 250)

const v1 = new Vertex(f, p, true)
const v2 = new Vertex(m, p, true)

const v3 = new Vertex(s1, p)
const v4 = new Vertex(s2, p)
const v5 = new Vertex(s3, p)

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
