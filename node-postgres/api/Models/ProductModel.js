const dbinfo = require('../dbinfo.js');

const pool = dbinfo.pool;

const getProducts = () => {
  return new Promise(function (resolve, reject) {
    let psql = 'SELECT * FROM products JOIN countries ON products.country_id_production = countries.country_id ORDER BY products.id ASC';
    pool.query(psql, (error, results) => {
      if (error) {
        reject(error)
      }
      resolve(results.rows);
    })
  })
}

const updateProduct = (id, body) => {
  return new Promise(function (resolve, reject) {
    const { product_name, color, weight, price_currency, price, country_id, image_url} = body;
    console.log(body)
    console.log(weight)

    pool.query(
      'UPDATE products SET product_name = $1, color = $2, weight_kg = $3, price = $4, country_id_production = $5, image_url = $6 WHERE id = $7 RETURNING *',
      [product_name, color, weight, price, country_id, image_url, id],
      (error, results) => {
        if (error) {
          reject(error);
        }
        resolve(`Product modified with ID: ${results.rows[0].id}`);
      }
    );
  });
};

const createProductFull = (body) => {
  return new Promise(function (resolve, reject) {
    const { product, productioncountry, color, usagefrequency, weight_kg, sizelength, sizewidth, sizeheight, price, image_url } = body
    pool.query('INSERT INTO products (product, productioncountry, color, usagefrequency, weight_kg, sizelength, sizewidth, sizeheight, price, image_url) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *', [product, productioncountry, color, usagefrequency, weight_kg, sizelength, sizewidth, sizeheight, price, image_url], (error, results) => {
      if (error) {
        reject(error)
      }
      resolve(`A new product has been added added: ${results.rows[0]}`)
    })
  })
}

const createProduct = (body) => {
  return new Promise(function (resolve, reject) {
    const { product, productioncountry, color, weight_kg, price } = body
    pool.query('INSERT INTO products (product, productioncountry, color, weight_kg, price) VALUES ($1, $2, $3, $4, $5) RETURNING *', [product, productioncountry, color, weight_kg, price], (error, results) => {
      if (error) {
        reject(error)
      }
      resolve(`A new product has been added added: ${results.rows[0]}`)
    })
  })
}

const deleteProduct = (productId) => {
  return new Promise(function (resolve, reject) {
    const id = parseInt(productId)
    pool.query('DELETE FROM products WHERE id = $1', [id], (error, results) => {
      if (error) {
        console.log(error);
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
  updateProduct,
}