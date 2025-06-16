/** @import {Coordinate, FamilyData, FamilyElements} from "../../types.js" */
import { Point } from "../figures/Point.js";
import { Vertex } from "../figures/Vertex.js";
import { Edge } from "../figures/Edge.js";
import GenealogicalTree from "./GenealogicalTree.js";
import FamilyTree from "./FamilyTree.js";

export default class TreeBuilder {
  static anchorCoordinates = {x: 0, y: 0};

  static existingPersonVertices = new Map();
  static boundariesList = [];
  static familyTreesQueue = [];

  /** 
   * @param {FamilyData} familyData
   * @param {Coordinate} startingCoordinate
   */

  constructor(familyData, startingCoordinate = null) {
    this.familyData = familyData;

    /** @type {FamilyElements} */
    this.createdElements = {
      anchor: null,
      vertices: [],
      edges: [],
      boundaries: { x: 0, y: 0, width: 0, height: 0 }
    };

    if (startingCoordinate !== null) {
      TreeBuilder.anchorCoordinates = startingCoordinate;
    }

    this.buildElements();
  }

  static async query(familyId, startingCoordinate) {
    const url = new URL(
      location.pathname + 'api/' + familyId,
      window.env.server_url
    );

    const req = new Request(url);
    const response = await fetch(req);
    const data = await response.json();

    new FamilyTree(data).build(startingCoordinate);
    if (TreeBuilder.familyTreesQueue.length === 0) {
      GenealogicalTree.draw();
    }
  }

  buildElements() {
    const partners = this.familyData['partners'];
    const children = this.familyData['children'];

    const width = this.evaluateWidth(children.length);
    this.buildAnchorPoint();
    this.buildPartnersVertices(partners);
    this.buildChildrenVertices(children);

    this.createdElements.boundaries = {
      x: TreeBuilder.anchorCoordinates.x - width / 2,
      y: TreeBuilder.anchorCoordinates.y - 200,
      width: width,
      height: 2 * 200 + Vertex.defaultParams.height
    }

    TreeBuilder.boundariesList.push(this.createdElements.boundaries);

    if (TreeBuilder.familyTreesQueue.length !== 0) {
      const familyId = TreeBuilder.familyTreesQueue.shift();
      TreeBuilder.query(familyId['id'], {
        x: this.createdElements.boundaries.x + width / 2,
        y: this.createdElements.boundaries.y - (200 + Vertex.defaultParams.width)
      });
    }
  }

  evaluateWidth(childrenNumber) {
    if (childrenNumber === 1) {
      return Vertex.defaultParams.width * 2;
    }
    
    return Vertex.defaultParams.width * 4 * (Math.floor(childrenNumber / 2) + 1/4);
  }

  buildAnchorPoint() {
     if (TreeBuilder.boundariesList.length === 0) {
      TreeBuilder.anchorCoordinates = {
        x: GenealogicalTree.canvas.width / 2,
        y: GenealogicalTree.canvas.height / 2
      }
    }

    else {
      const width = this.evaluateWidth(this.familyData['children'].length);
      TreeBuilder.anchorCoordinates.x += width / 2; 
    }

    this.anchorPoint = new Point(
      TreeBuilder.anchorCoordinates.x,
      TreeBuilder.anchorCoordinates.y
    );

    this.createdElements['anchor'] = this.anchorPoint; 
  }

  buildPartnersVertices(partners) {
    const malePartnerData = partners.find((partner) => partner['sex'] == 'male');
    const femalePartnerData = partners.find((partner) => partner['sex'] == 'female');

    let malePartnerVertex;
    let femalePartnerVertex;

    if (TreeBuilder.existingPersonVertices.has(malePartnerData['id'])) {
      malePartnerVertex = TreeBuilder.existingPersonVertices.get(malePartnerData['id']);
    }

    else {
      malePartnerVertex = new Vertex(
      TreeBuilder.anchorCoordinates.x - Vertex.defaultParams.width * 1.7,
      TreeBuilder.anchorCoordinates.y - 200,
      malePartnerData['firstname']
    );

    TreeBuilder.existingPersonVertices.set(
      malePartnerData['id'],
      malePartnerVertex
    );
    }
    
    const malePartnerEdge = new Edge(malePartnerVertex, this.anchorPoint, true);

    if (TreeBuilder.existingPersonVertices.has(femalePartnerData['id'])) {
      femalePartnerVertex = TreeBuilder.existingPersonVertices.get(femalePartnerData['id']);
    }

    else {
      femalePartnerVertex = new Vertex(
        TreeBuilder.anchorCoordinates.x + Vertex.defaultParams.width * 0.7,
        TreeBuilder.anchorCoordinates.y - 200,
        femalePartnerData['firstname']
      );

      TreeBuilder.existingPersonVertices.set(
        femalePartnerData['id'],
        femalePartnerVertex
      );
    }
    
    const femalePartnerEdge = new Edge(femalePartnerVertex, this.anchorPoint, true);

    this.createdElements['vertices'].push(malePartnerVertex, femalePartnerVertex);
    this.createdElements['edges'].push(malePartnerEdge, femalePartnerEdge);

    for (let partner of partners)
    {
      if (partner['linked_family_id'] !== null) {
        TreeBuilder.familyTreesQueue.push(
          {
            'id': partner['linked_family_id'],
            'tree_coordinates': {
              x: TreeBuilder.anchorCoordinates.x,
              y: TreeBuilder.anchorCoordinates.y + 400
            }
          }
        );
      }
    }
  }

  buildChildrenVertices(children) {
    const childrenNumber = children.length;
    const patternList = generateSpacingPattern(childrenNumber);

    for (let index = 0; index < childrenNumber; index++) {

      let childVertex;
      if (TreeBuilder.existingPersonVertices.has(children[index]['id'])) {
        childVertex = TreeBuilder.existingPersonVertices.get(children[index]['id']);
      }

      else {
        childVertex = new Vertex(
          TreeBuilder.anchorCoordinates.x + Vertex.defaultParams.width * 2 * (patternList[index] - 1/4),
          TreeBuilder.anchorCoordinates.y + 200,
          children[index]['firstname'],
        );
      }

      const childToAnchorEdge = new Edge(childVertex, this.anchorPoint);
      this.createdElements.vertices.push(childVertex);
      this.createdElements.edges.push(childToAnchorEdge);

      if (children[index]['linked_family_id'] !== null) {
        TreeBuilder.familyTreesQueue.push(
          {
            'id': partner['linked_family_id'],
            'tree_coordinates': {
              x: TreeBuilder.anchorCoordinates.x,
              y: TreeBuilder.anchorCoordinates.y + 400
            }
          }
        );
      }
    }
  }
}

function generateSpacingPattern(numberOfElements) {
  const startIndex = Math.floor(numberOfElements / 2);
  const patternList = [];

  for (let i = -startIndex; i <= startIndex; i++) {
    patternList.push(i);
  }

  if (numberOfElements % 2 == 0) {
    patternList.splice(startIndex, 1);
  }

  return patternList;
}
