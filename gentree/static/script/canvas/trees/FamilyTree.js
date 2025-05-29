/** @import {FamilyElements} from "../../types.js" */
import TreeBuilder from "./TreeBuilder.js";
import GenealogicalTree from "./GenealogicalTree.js";

export default class FamilyTree {
  constructor() {
    /** @type {FamilyElements} */
    this.elements = {
      anchor: null,
      vertices: [],
      edges: [],
    };

    this.reliedTo = {
      family: null,
      member: null,
    };

    this.builder = new TreeBuilder();
  }

  build(family) {
    this.data = family;
    const retrievedObj = this.builder.createElements(this.data);

    this.elements.anchor = retrievedObj["anchor"];
    this.elements.vertices = retrievedObj["vertices"];
    this.elements.edges = retrievedObj["edges"];
    this.elements.boundaries = retrievedObj["boundaries"];

    GenealogicalTree.registerTree(this);
  }

  reset() {
    this.elements.vertices.forEach((el) => el.reset());
  }

  draw(context) {
    this.elements.vertices.forEach((vertex) => {
      if (!vertex.rendered) {
        vertex.draw(context);
      }
    });

    const otherElements = [this.elements.anchor, ...this.elements.edges];

    otherElements.forEach((element) => {
      element.draw(context);
    });

    GenealogicalTree.context.strokeRect(
      this.elements.boundaries.startingX,
      this.elements.boundaries.startingY,
      this.elements.boundaries.endingX - this.elements.boundaries.startingX,
      this.elements.boundaries.endingY - this.elements.boundaries.startingY
    );
  }
}
