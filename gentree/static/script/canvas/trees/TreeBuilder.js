/** @import {FamilyData, FamilyElements} from "../../types.js" */
import { Point } from "../figures/Point.js";
import { Vertex } from "../figures/Vertex.js";
import { Edge } from "../figures/Edge.js";
import GenealogicalTree from "./GenealogicalTree.js";

export default class TreeBuilder {
  static anchorCoordinates = {x: 0, y: 0};

  static existingPersonVertices = {};
  static boundariesList = [];

  /** @param {FamilyData} familyData */
  constructor(familyData) {
    this.familyData = familyData;

    /** @type {FamilyElements} */
    this.createdElements = {
      anchor: null,
      vertices: [],
      edges: [],
      boundaries: {
        starting: {x: 0, y: 0},
        ending: {x: 0, y: 0},
      }
    };

    this.buildElements();
  }

  buildElements() {
    const partners = this.familyData['partners'];
    const children = this.familyData['children'];

    this.defineBoundaries(children.length);
    this.buildAnchorPoint();
    this.buildPartnersVertices(partners);
    this.buildChildrenVertices(children);
  }

  defineBoundaries(childrenLength) {
    if (TreeBuilder.boundariesList.length === 0) {
      TreeBuilder.anchorCoordinates = {
        x: GenealogicalTree.canvas.width / 2,
        y: GenealogicalTree.canvas.height / 2
      }
    }

    if (childrenLength == 1) {
      this
      .createdElements
      .boundaries
      .starting
      .x = TreeBuilder.anchorCoordinates.x + Vertex.defaultParams.width * -1.2 - Vertex.defaultParams.width / 2;

      this
      .createdElements
      .boundaries
      .ending
      .x = TreeBuilder.anchorCoordinates.x + Vertex.defaultParams.width * 2.2 - Vertex.defaultParams.width / 2;
    }

    else {
      this
      .createdElements
      .boundaries
      .starting
      .x = TreeBuilder.anchorCoordinates.x - Vertex.defaultParams.width * 2.5 * Math.floor(childrenLength / 2);

      this
      .createdElements
      .boundaries
      .ending
      .x = TreeBuilder.anchorCoordinates.x + Vertex.defaultParams.width * 2.5 * Math.floor(childrenLength / 2);
    }

    this
    .createdElements
    .boundaries
    .starting
    .y = TreeBuilder.anchorCoordinates.y - 200;

    this
    .createdElements
    .boundaries
    .ending
    .y = TreeBuilder.anchorCoordinates.y + 200 + Vertex.defaultParams.height;
  }

  buildAnchorPoint() {
    this.anchorPoint = new Point(
      TreeBuilder.anchorCoordinates.x,
      TreeBuilder.anchorCoordinates.y
    );

    this.createdElements['anchor'] = this.anchorPoint; 
  }

  buildPartnersVertices(partners) {
    const malePartnerData = partners.find((partner) => partner['sex'] == 'male');
    const femalePartnerData = partners.find((partner) => partner['sex'] == 'female');

    const malePartnerVertex = new Vertex(
      TreeBuilder.anchorCoordinates.x - Vertex.defaultParams.width * 1.7,
      TreeBuilder.anchorCoordinates.y - 200,
      malePartnerData['firstname']
    );

    const malePartnerEdge = new Edge(malePartnerVertex, this.anchorPoint, true);

    const femalePartnerVertex = new Vertex(
      TreeBuilder.anchorCoordinates.x + Vertex.defaultParams.width * 0.7,
      TreeBuilder.anchorCoordinates.y - 200,
      femalePartnerData['firstname']
    );

    const femalePartnerEdge = new Edge(femalePartnerVertex, this.anchorPoint, true);

    this.createdElements['vertices'].push(malePartnerVertex, femalePartnerVertex);
    this.createdElements['edges'].push(malePartnerEdge, femalePartnerEdge);
  }

  buildChildrenVertices(children) {
    const childrenNumber = children.length;
    const patternList = generateSpacingPattern(childrenNumber);

    for (let index = 0; index < childrenNumber; index++) {
      const childVertex = new Vertex(
        TreeBuilder.anchorCoordinates.x + Vertex.defaultParams.width * 2 * (patternList[index] - 1/4),
        TreeBuilder.anchorCoordinates.y + 200,
        children[index]['firstname'],
      );

      const childToAnchorEdge = new Edge(childVertex, this.anchorPoint);
      this.createdElements.vertices.push(childVertex);
      this.createdElements.edges.push(childToAnchorEdge);
    }
  }
}

function generateSpacingPattern(numberOfElements) {
  const startIndex = Math.floor(numberOfElements / 2);
  const patternList = [];

  for (let i = -startIndex; i <= startIndex; i++) {
    patternList.push(i);
  }

  return patternList;
}
