//const pool = require('./Pool.js')

// const Pool = require('pg').Pool;

// const pool = new Pool({
//   user: 'postgres',
//   host: 'localhost',
//   database: 'my_database',
//   password: 'postgres',
//   port: 5432,
// });

const dbinfo = require('../dbinfo.js');

const pool = dbinfo.pool;

const getProducts = () => {
  return new Promise(function (resolve, reject) {
    pool.query('SELECT * FROM products ORDER BY id ASC', (error, results) => {
      if (error) {
        reject(error)
      }
      resolve(results.rows);
    })
  })
}
const createProductFull = (body) => {
  return new Promise(function (resolve, reject) {
    const { product, productionCountry, color, usageFrequency, salesCountry, sizeLength, sizeWidth, sizeHeight, price } = body
    pool.query('INSERT INTO products (product, productioncountry, color, usagefrequency, salescountry, sizelength, sizewidth, sizeheight, price) VALUES ($1, $2) RETURNING *', [product, productionCountry, color, usageFrequency, salesCountry, sizeLength, sizeWidth, sizeHeight, price], (error, results) => {
      if (error) {
        reject(error)
      }
      resolve(`A new product has been added added: ${results.rows[0]}`)
    })
  })
}
const createProduct = (body) => {
  return new Promise(function (resolve, reject) {
    const { product, productionCountry, color, salesCountry, price } = body
    pool.query('INSERT INTO prodcuts (product, productioncountry, color, salescountry, price) VALUES ($1, $2) RETURNING *', [product, productionCountry, color, usageFrequency, salesCountry, sizeLength, sizeWidth, sizeHeight, price], (error, results) => {
      if (error) {
        reject(error)
      }
      resolve(`A new product has been added added: ${results.rows[0]}`)
    })
  })
}
const deleteProduct = () => {
  return new Promise(function (resolve, reject) {
    const id = parseInt(request.params.id)
    pool.query('DELETE FROM products WHERE id = $1', [id], (error, results) => {
      if (error) {
        reject(error)
      }
      resolve(`Product deleted with ID: ${id}`)
    })
  })
}

module.exports = {
  getProducts,
  createProduct,
  createProductFull,
  deleteProduct,
}