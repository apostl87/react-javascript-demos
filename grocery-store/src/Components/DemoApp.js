import React, { useState, useEffect } from 'react';
function DemoApp() {
    const [products, setProducts] = useState(false);

    useEffect(() => {
        getProducts();
    }, []);

    function getProducts() {
        fetch('http://localhost:3001')
            .then(response => {
                return response.text();
            })
            .then(data => {
                setProducts(JSON.parse(data));
            });
    }

    function createProduct() {
        let product = prompt('Enter product name: ');
        let productionCountry = prompt('Enter production country:');
        let color = prompt('Enter predominant product color: ');
        let salesCountry = prompt('Enter sales country: ');
        let price = prompt('Enter price: ');

        fetch('http://localhost:3001/products', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ product, productionCountry, color, salesCountry, price }),
        })
            .then(response => {
                return response.text();
            })
            .then(data => {
                alert(data);
                getProducts();
            });
    }

    function deleteProduct() {
        let id = prompt('Enter product id: ');

        fetch(`http://localhost:3001/products/${id}`, {
            method: 'DELETE',
        })
            .then(response => {
                return response.text();
            })
            .then(data => {
                alert(data);
                getProducts();
            });
    }

    let displayProducts;
    let content;

    if (products) {
        displayProducts = products.filter(product => (product.id <= 10));
        content = displayProducts.map((product) => {
            return (
                <div key={product.id} style={{display: 'flex', gap: 5}}>
                    <p>{product.product}</p>
                    <p>{product.productionCountry}</p>
                    <p>{product.color}</p>
                    <p>{product.salesCountry}</p>
                    <p>{product.price}</p>
                </div>
            )
        })
    }

    return (
        <div>
            {products ? content : 'There is no product data available'}
            <br />
            <button onClick={createProduct}>Add product</button>
            <br />
            <button onClick={deleteProduct}>Delete product</button>
        </div>
    );
}
export default DemoApp;