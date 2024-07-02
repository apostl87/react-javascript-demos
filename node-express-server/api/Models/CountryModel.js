const dbinfo = require('../dbinfo.js');

const pool = dbinfo.pool;

const getCountries = () => {
	return new Promise(function (resolve, reject) {
		let psql = 'SELECT * FROM countries ORDER BY country_name ASC';
		pool.query(psql, (error, results) => {
			if (error) {
				reject(error)
			}
			resolve(results.rows);
		})
	})
}

module.exports = {
	getCountries,
}
