export default class GenealogicalTree {
  static scale = 0.6;
  static existingTree = null;
  /** @type {FamilyTree[]} */
  static subtreesList = [];
  /** @type {CanvasRenderingContext2D | null} */
  static context = null;
  static canvas = null;
  static isPanMode = false;
  static panOffset = { x: 0, y: 0 };
  static scaledOffset = { x: 0, y: 0 };
  static baseOffset = { x: 0, y: 0 };
  static deltaOffset = { x: 0, y: 0 };

  constructor(canvas) {
    if (GenealogicalTree.existingTree !== null) {
      return GenealogicalTree.existingTree;
    }

    GenealogicalTree.canvas = canvas;
    GenealogicalTree.existingTree = this;
    this.initContext(GenealogicalTree.canvas);
  }

  initContext(canvas) {
    GenealogicalTree.context = canvas.getContext("2d");
  }

  static zoomIn() {
    if (GenealogicalTree.scale < 1.2) {
      GenealogicalTree.scale += 0.05;
      GenealogicalTree.draw();
    }
  }

  static zoomOut() {
    if (GenealogicalTree.scale > 0.2) {
      GenealogicalTree.scale -= 0.05;
      GenealogicalTree.draw();
    }
  }

  static handlePanMoves(mouseX, mouseY) {
    if (GenealogicalTree.isPanMode) {
      GenealogicalTree.deltaOffset = {
        x: mouseX - GenealogicalTree.baseOffset.x,
        y: mouseY - GenealogicalTree.baseOffset.y,
      };

      GenealogicalTree.draw();
    }
  }

  static handleRelease(mouseX, mouseY) {
    if (GenealogicalTree.isPanMode) {
      GenealogicalTree.isPanMode = false;
      GenealogicalTree.deltaOffset = { x: 0, y: 0 };

      GenealogicalTree.panOffset = {
        x:
          GenealogicalTree.panOffset.x + GenealogicalTree.baseOffset.x - mouseX,
        y:
          GenealogicalTree.panOffset.y + GenealogicalTree.baseOffset.y - mouseY,
      };
    }
  }

  static reset() {
    GenealogicalTree.context.reset();

    for (let el of GenealogicalTree.subtreesList) {
      el.reset();
    }
  }

  static draw() {
    GenealogicalTree.reset();

    const scaleWidth = GenealogicalTree.canvas.width * GenealogicalTree.scale;
    const scaleHeight = GenealogicalTree.canvas.height * GenealogicalTree.scale;

    GenealogicalTree.context.save();

    GenealogicalTree.context.lineWidth = 2;

    GenealogicalTree.scaledOffset = {
      x: (scaleWidth - GenealogicalTree.canvas.width) / 2,
      y: (scaleHeight - GenealogicalTree.canvas.height) / 2,
    };

    GenealogicalTree.context.translate(
      GenealogicalTree.panOffset.x -
        GenealogicalTree.deltaOffset.x -
        GenealogicalTree.scaledOffset.x,
      GenealogicalTree.panOffset.y -
        GenealogicalTree.deltaOffset.y -
        GenealogicalTree.scaledOffset.y
    );

    GenealogicalTree.context.scale(
      GenealogicalTree.scale,
      GenealogicalTree.scale
    );

    for (let el of GenealogicalTree.subtreesList) {
      el.draw(GenealogicalTree.context);
    }

    GenealogicalTree.context.restore();
  }

  /** @param {FamilyTree} tree */
  static registerTree(tree) {
    GenealogicalTree.subtreesList.push(tree);
  }
}
