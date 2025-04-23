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
 * @typedef {object} members
 *
 * @property {Array<Person>} parents
 * @property {Array<Person>} children
*/

/**
 * @typedef {object} Family
 *
 * @property {number} uid
 * @property {String} name 
 * @property {object} payload
*/
