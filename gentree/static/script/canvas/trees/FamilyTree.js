/** @import {Coordinate, FamilyData} from "../../types.js" */
import TreeBuilder from "./TreeBuilder.js";
import GenealogicalTree from "./GenealogicalTree.js";

export default class FamilyTree {
  /** @param {FamilyData} familyData */
  constructor(familyData) {
    this.familyData = familyData;
  }

  /** @param {Coordinate} startingCoordinate */
  build(startingCoordinate = null) {
    const builder = new TreeBuilder(this.familyData, startingCoordinate);
    this.elements = builder.createdElements;
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
      this.elements.boundaries.x,
      this.elements.boundaries.y,
      this.elements.boundaries.width,
      this.elements.boundaries.height,
    );
  }
}
