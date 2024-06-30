const express = require('express');
const cors = require('cors');
const ProductModel = require('./Models/ProductModel.js');
const CountryModel = require('./Models/CountryModel.js');

const app = express()
const port = 3001

app.use(express.json())

// Enable CORS for cross-origin requests
app.use(cors());

app.use(function (req, res, next) {
	// res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
	// res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3002');
	res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
	res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Access-Control-Allow-Headers');
	next();
});

app.get('/', (req, res) => {
	ProductModel.getProducts()
	.then(response => {
		res.status(200).send(response);
	})
	.catch(error => {
		res.status(500).send(error);
	})
})

app.post('/products', (req, res) => {
	ProductModel.createProduct(req.body)
	.then(response => {
		res.status(200).send(response);
	})
	.catch(error => {
		res.status(500).send(error);
	})
})

app.delete('/products/:id', (req, res) => {
	ProductModel.deleteProduct(req.params.id)
	.then(response => {
		res.status(200).send(response);
	})
	.catch(error => {
		res.status(500).send(error);
	})
})

app.put('/products/:id', (req, res) => {
	const id = parseInt(req.params.id);
	ProductModel.updateProduct(id, req.body)
		.then(response => {
			res.status(200).send(response);
		})
		.catch(error => {
			res.status(500).send(error);
		})
})

app.get('/countries', (req, res) => {
	CountryModel.getCountries()
	.then(response => {
		res.status(200).send(response);
	})
	.catch(error => {
		res.status(500).send(error);
	})
})

app.listen(port, () => {
	console.log(`API running on port ${port}.`)
})
