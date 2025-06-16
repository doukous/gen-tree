import FamilyTree from "./canvas/trees/FamilyTree.js";
import GenealogicalTree from "./canvas/trees/GenealogicalTree.js";
import { monitorInteraction } from "./Interactions.js";

window.env = {
  server_url: "http://127.0.0.1:8000"
}

const canvas = document.querySelector("canvas");
new GenealogicalTree(canvas);

const url = new URL(
  location.pathname + 'api',
  window.env.server_url
);
const req = new Request(url);

async function displayTree() {
  
  const response = await fetch(req);

  if (!response.ok) {
    throw new Error(`Response status: ${response.status}`);
  }

  const data = await response.json();
  new FamilyTree(data).build();

  monitorInteraction();
}

displayTree();
