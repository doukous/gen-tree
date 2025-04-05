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
 * @property {Coordinate | null} coordinate
 * @property {"parent" | "child"} role
 */

/**
 * @typedef {object} payload
 *
 * @property {Array<Person>} parents
 * @property {Array<Person>} children
 */

/**
 * @typedef {object} familyData
 *
 * @property {number} id
 * @property {"family"} type
 * @property {object} payload
 */

/**
 * @typedef {object} personData
 *
 * @property {number} id
 * @property {"person"} type
 * @property {string} lastname
 * @property {object} payload
 */
