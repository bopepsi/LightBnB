const properties = require('./json/properties.json');
const users = require('./json/users.json');
const { Pool, Client } = require('pg');

const pool = new Pool({
  user: 'vagrant',
  password: '123',
  host: 'localhost',
  database: 'lightbnb',
  port: 5432
})

const client = new Client({
  user: 'vagrant',
  password: '123',
  host: 'localhost',
  database: 'lightbnb',
  port: 5432
})

/// Users

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithEmail = async function (email) {
  try {
    const { rows } = await pool.query(`SELECT * FROM users WHERE email = $1`, [email]);
    if (!rows) return null;
    return rows[0];
  } catch (error) {
    throw (error['message']);
  }
}
exports.getUserWithEmail = getUserWithEmail;

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = async function (id) {
  try {
    const { rows } = await pool.query(`SELECT * FROM users WHERE id = $1`, [id]);
    if (!rows) return null;
    return rows[0];
  } catch (error) {
    throw (error['message']);
  }
}
exports.getUserWithId = getUserWithId;


/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser = async function (user) {

  try {
    await pool.query(`INSERT INTO users (name, email, password) VALUES ($1, $2, $3)`, [user.name, user.email, user.password]);
    return true;
  } catch (error) {
    throw (error['message']);
  }
}
exports.addUser = addUser;

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = async function (guest_id, limit = 10) {
  try {
    const { rows } = await pool.query(`SELECT
    reservations.*,
    properties.title,
    properties.cost_per_night,
    avg(rating) as average_rating
FROM
    reservations
    JOIN properties ON reservations.property_id = properties.id
    JOIN property_reviews ON properties.id = property_reviews.property_id
WHERE
    reservations.guest_id = $1
GROUP BY
    properties.id,
    reservations.id
ORDER BY
    reservations.start_date
LIMIT
    $2;`, [guest_id, limit]);
    return rows;
  } catch (error) {
    console.log('error')
    throw (error['message']);
  }
}
exports.getAllReservations = getAllReservations;

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */
const getAllProperties = async function (options, limit = 10) {
  console.log(options);
  let result;
  let { city, owner_id, minimum_price_per_night, maximum_price_per_night, minimum_rating } = options;
  try {
    result = await pool.query(`SELECT
    properties.*,
    min(property_reviews.rating) as minimum_rating
FROM
    properties
    LEFT JOIN property_reviews ON properties.id = property_id
GROUP BY
    1
ORDER BY
    cost_per_night
    ;`);
  } catch (error) {
    throw (error['message']);
  }

  if (owner_id) {
    try {
      console.log(owner_id);
      result = await pool.query(`SELECT
    properties.*,
    min(property_reviews.rating) as minimum_rating
FROM
    properties
    LEFT JOIN property_reviews ON properties.id = property_id
${`WHERE owner_id = $1`}
GROUP BY
    1
ORDER BY
    cost_per_night
    ;`, [owner_id]);
    } catch (error) {
      throw (error['message']);
    }
  }

  if (city) {
    try {
      result = await pool.query(`SELECT
    properties.*,
    min(property_reviews.rating) as minimum_rating
FROM
    properties
    LEFT JOIN property_reviews ON properties.id = property_id
${`WHERE city LIKE $1`}
GROUP BY
    1
ORDER BY
    cost_per_night
    ;`, [city]);
    } catch (err) {
      throw err['message'];
    }
  }

  if (minimum_price_per_night) {
    try {
      result = await pool.query(`SELECT
    properties.*,
    min(property_reviews.rating) as minimum_rating
FROM
    properties
    LEFT JOIN property_reviews ON properties.id = property_id
${`WHERE cost_per_night > $1`}
GROUP BY
    1
ORDER BY
    cost_per_night
    ;`, [minimum_price_per_night * 100]);
    } catch (err) {
      throw err['message'];
    }
  }

  if (maximum_price_per_night) {
    try {
      result = await pool.query(`SELECT
    properties.*,
    min(property_reviews.rating) as minimum_rating
FROM
    properties
    LEFT JOIN property_reviews ON properties.id = property_id
${`WHERE cost_per_night > $1`}
GROUP BY
    1
ORDER BY
    cost_per_night
    ;`, [maximum_price_per_night * 100]);
    } catch (err) {
      throw err['message'];
    }
  }

  if (minimum_rating) {
    try {
      result = await pool.query(`SELECT
    properties.*,
    min(property_reviews.rating) as minimum_rating
FROM
    properties
    LEFT JOIN property_reviews ON properties.id = property_id
GROUP BY
    1
${`HAVING rating > $1`}
ORDER BY
    cost_per_night
    ;`, [minimum_rating]);
    } catch (err) {
      throw err['message'];
    }
  }

  try {
    result = await pool.query(`SELECT
    properties.*,
    min(property_reviews.rating) as minimum_rating
FROM
    properties
    LEFT JOIN property_reviews ON properties.id = property_id
GROUP BY
    1
ORDER BY
    cost_per_night
LIMIT
  $1    
    ;`, [limit]);
  } catch (error) {
    throw (error['message']);
  }
  return result.rows;
}
exports.getAllProperties = getAllProperties;


/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = async function (property) {

  let { owner_id, title, description, thumbnail_photo_url, cover_photo_url, cost_per_night, street, city, province, post_code, country, parking_spaces, number_of_bathrooms, number_of_bedrooms } = property;

  try {
    const result = await pool.query(`
  INSERT INTO 
    properties (owner_id, title, description, thumbnail_photo_url, cover_photo_url, cost_per_night, street, city, province, post_code, country, parking_spaces, number_of_bathrooms, number_of_bedrooms) 
  VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14) RETURNING *
  ;`, [owner_id, title, description, thumbnail_photo_url, cover_photo_url, cost_per_night, street, city, province, post_code, country, parking_spaces, number_of_bathrooms, number_of_bedrooms]);
  console.log(result.rows);
  return result.rows;
  } catch (error) {
    throw (error['message']);
  };
  // const propertyId = Object.keys(properties).length + 1;
  // property.id = propertyId;
  // properties[propertyId] = property;
  // return Promise.resolve(property);
}
exports.addProperty = addProperty;