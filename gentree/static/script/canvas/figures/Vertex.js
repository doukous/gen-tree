import { GraphicalElement } from "../figures/GraphicalElement.js";
import GenealogicalTree from "../trees/GenealogicalTree.js";

/**
 * Represents a family member
 */
export class Vertex extends GraphicalElement {
  /**
   * @type {Array<Vertex>} - the list of vertices
   *                         triggered by checkPosition function
   */
  static vertices = [];

  static defaultParams = {
    width: 100,
    height: 80
  }

  /**
   * The Vertex constructor
   *
   * @param {number} x - the X coordinate
   * @param {number} y - the Y coordinate
   * @param {string} firstname - the firstname
   * @param {number} width - the width
   * @param {number} height - the height
   *
   */
  constructor(
    x, 
    y, 
    firstname = "", 
    width = Vertex.defaultParams.width, 
    height = Vertex.defaultParams.height
  ) {
    super();
    this.x = x;
    this.y = y;
    this.z = 0;
    this.firstname = firstname;

    /**
     * @type {Array<Edge>} - The array of vertexConfig linked to box
     */
    this.edgesList = [];

    this.width = width;
    this.height = height;
    this.rendered = false;

    Vertex.vertices.push(this);
  }

  /**
   * @type {Vertex | null}
   */
  static draggedVertex = null;

  static firedVertices = [];

  get EdgeX() {
    return this.x + this.width / 2;
  }

  getEdgeY(onTop = false) {
    return onTop ? this.y : this.y + this.height;
  }

  registerEdge(e) {
    this.edgesList.push(e);
  }

  alertEdge() {
    this.edgesList.forEach((v) => {
      v.updateCoordinate(this);
    });
  }

  reset() {
    this.rendered = false;
  }

  draw(ctx) {
    ctx.roundRect(this.x, this.y, this.width, this.height, 10);
    ctx.stroke();

    ctx.save();
    ctx.font = "17px serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(
      this.firstname,
      this.x + this.width / 2,
      this.y + this.height / 2
    );
    ctx.restore();

    this.rendered = true;
  }

  /**
   * The function that react to box move
   *
   * @param {number} x - the X coordinate
   * @param {number} y - the Y coordinate
   */
  static updateCoordinate(x, y) {
    Vertex.draggedVertex.x = x;
    Vertex.draggedVertex.y = y;

    Vertex.draggedVertex.alertEdge();
    GenealogicalTree.draw();
  }

  static handleRelease() {
    Vertex.firedVertices = [];
    Vertex.draggedVertex = null;
  }

  static checkPosition(mouseX, mouseY) {
    for (let el of Vertex.vertices) {
      if (
        mouseX >= el.x &&
        mouseX <= el.x + el.width &&
        mouseY >= el.y &&
        mouseY <= el.y + el.height
      ) {
        if (!Vertex.firedVertices.includes(el)) {
          Vertex.firedVertices.push(el);
        }
      } else {
        if (Vertex.firedVertices.includes(el)) {
          const index = Vertex.firedVertices.indexOf(el);
          Vertex.firedVertices.splice(index, 1);
        }
      }
    }

    if (Vertex.firedVertices.length === 0) {
      GenealogicalTree.isPanMode = true;
      return;
    } else if (Vertex.firedVertices.length === 1) {
      Vertex.draggedVertex = Vertex.firedVertices[0];
      Vertex.draggedVertex.z = 0;
    } else if (
      Vertex.firedVertices.length > 1 &&
      Vertex.draggedVertex === null
    ) {
      const topValue = [Vertex.firedVertices[0].z, Vertex.firedVertices[0]];

      for (let el of Vertex.firedVertices) {
        if (el.z > topValue[0]) {
          topValue[0] = el.z;
          topValue[1] = el;
        }
      }

      Vertex.draggedVertex = topValue[1];
    } else if (
      Vertex.firedVertices.length > 1 &&
      Vertex.draggedVertex !== null
    ) {
      const topValue = [Vertex.firedVertices[0].z, Vertex.firedVertices[0]];

      for (let el of Vertex.firedVertices) {
        if (el.z > topValue[0]) {
          topValue[0] = el.z;
          topValue[1] = el;
        }
      }

      if (Vertex.draggedVertex === topValue[1] && topValue[0] === 0) {
        this.draggedVertex.z = 1;
      } else if (Vertex.draggedVertex !== topValue[1]) {
        this.draggedVertex.z = topValue[0] + 1;
      }
    }

    if (this.firedVertices.length !== 0) {
      Vertex.updateCoordinate(mouseX - 40, mouseY - 40);
    }
  }
}
