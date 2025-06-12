/** @import {FamilyData} from "../../types.js" */
import TreeBuilder from "./TreeBuilder.js";
import GenealogicalTree from "./GenealogicalTree.js";

export default class FamilyTree {
  /** @param {FamilyData} familyData */
  constructor(familyData) {
    this.familyData = familyData;
    this.build();
  }

  build() {
    const builder = new TreeBuilder(this.familyData)
    this.elements = builder.createdElements
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
      this.elements.boundaries.starting.x,
      this.elements.boundaries.starting.y,
      this.elements.boundaries.ending.x - this.elements.boundaries.starting.x,
      this.elements.boundaries.ending.y - this.elements.boundaries.starting.y,
    );

    GenealogicalTree.context.strokeRect(
      this.elements.boundaries.starting.x * 1.8,
      this.elements.boundaries.starting.y - 400,
      400, 400
    );

    GenealogicalTree.context.strokeRect(
      this.elements.boundaries.starting.x * 0.5,
      this.elements.boundaries.starting.y - 400,
      400, 400
    );
  }
}
