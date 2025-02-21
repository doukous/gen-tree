/**
 * The coordinates of a point
 * 
 * @typedef {object} Coordinate
 *
 * @property {number | null} x
 * @property {number | null} y
 */

/**
 * The person type, that can be a parent or a children
 * 
 * @typedef {Object} Person
 *
 * @property {string} firstname
 * @property {string} lastname
 * @property {Coordinate} pos
 */

/**
 * @interface
 */
export class InteractiveElement {
    /**
     * The method to implement for drawing
     *
     * @param {CanvasRenderingContext2D} context - The canvas context
     *
     * @returns {void}
     */
    draw(context) {}

    /**
     * The method triggered on rendering change
     * 
     * @param {number} clientX -the mouse X coordinate
     * @param {number} clientY - the mouse Y coordinate
     *
     * @returns {void}
     */
    checkPosition(clientX, clientY) {}

    /**
     * return the vertex coordinate on x-axis
     *
     * @returns {number}
     */
    get EdgeCoordX() {}

    /**
     * return the vertex coordinate on y-axis
     *
     * @param {boolean} onTop - specify whether the vertex is
     *                          on top or on bottom of the element
     *
     * @returns {number}
     */
    getEdgeCoordY(onTop=false) {}

    /**
     *  add a vertex to an element list of vertex
     *
     * @param {Vertex} v - a vertex that is linked to the element
     *
     * @returns {void}
     */
    registerEdge(v) {}

    /**
     *  alert all vertex registered
     *
     *  @returns {void}
     */
    alertEdge() {}
}
