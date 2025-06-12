import { Edge } from "./canvas/figures/Edge";
import { Point } from "./canvas/figures/Point";
import { Vertex } from "./canvas/figures/Vertex";

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
 * @property {number} uid
 * @property {string} firstname
 * @property {"male" | "female"} sex
 */

/**
 * @typedef {object} FamilyData
 *
 * @property {number} uid
 * @property {String} name
 * @property {Array<Person>} partners
 * @property {Array<Person>} children
 */

/**
 * @typedef {object} FamilyElements
 *
 * @property {Array<Vertex>} vertices
 * @property {Array<Edge>} edges
 * @property {Array<Point>} anchor
 * 
 * @property {object} boundaries
 * @property {Coordinate} boundaries.starting
 * @property {Coordinate} boundaries.ending
 * 
 */
