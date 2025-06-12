import FamilyTree from "./canvas/trees/FamilyTree.js";
import GenealogicalTree from "./canvas/trees/GenealogicalTree.js";
import { monitorInteraction } from "./Interactions.js";

const canvas = document.querySelector("canvas");
new GenealogicalTree(canvas);

const url = new URL(
  location.pathname + 'api',
  "http://127.0.0.1:5000"
);
const req = new Request(url);

async function displayTree() {
  
  const response = await fetch(req);

  if (!response.ok) {
    throw new Error(`Response status: ${response.status}`);
  }

  const data = await response.json();
  new FamilyTree(data);

  GenealogicalTree.draw();
  monitorInteraction();
}

displayTree();
