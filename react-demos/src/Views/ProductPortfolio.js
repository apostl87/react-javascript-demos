import React, { useState, useEffect, useRef } from 'react';
import '../static/css/ProductPortfolio.css'; // Import the CSS file
import { Tooltip } from 'react-tooltip';

function ProductPortfolioEditable() {
    // General data hooks
    const [products, setProducts] = useState([]);
    const [countries, setCountries] = useState([]);

    // Pagination hooks and variables
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 20;

    // Constants for displaying
    const WEIGHT_UNIT = 'kg';

    // Editing hooks
    const [editingProductId, setEditingProductId] = useState(null);
    const [editedProduct, setEditedProduct] = useState({});

    // Tooltip hooks
    const [isOpen, setIsOpen] = useState(null);
    const [tooltipState, setTooltipState] = useState(['', '']); // [name of input field, tooltip text]

    // HTTP requests
    useEffect(() => {
        getProducts();
        getCountries();
    }, []);

    function getProducts() {
        fetch('http://localhost:3001/')
            .then(response => response.json())
            .then(data => filterAndSaveProductData(data));
    }

    function filterAndSaveProductData(data) {
        const filteredData = data.map(data => {
            return {
                id: data.id,
                product: data.product_name,
                color: data.color,
                image_url: data.image_url,
                price_currency: data.price_currency,
                price: data.price,
                weight_kg: data.weight_kg,
                country_id: data.country_id,
                country_name: data.country_name,
            };
        });
        setProducts(filteredData);
    }

    function updateProduct(id) {
        console.log(JSON.stringify(editedProduct));
        fetch(`http://localhost:3001/products/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(editedProduct),
        })
            .then(response => response.text())
            .then(data => {
                setEditingProductId(null);
                getProducts();
            });
    }

    function createProduct() {
        return null
    }

    function deleteProduct() {
        return null;
    }

    function getCountries() {
        fetch('http://localhost:3001/countries')
            .then(response => response.json())
            .then(data => setCountries(data
            ));
    }

    // Functions for editing a product
    function selectCountry(countries) {
        return (
        <>
            <select id="country_id" name="country_id" onChange={handleInputChange}>
                {countries.map((country, idx) => { return <option key={idx} value={country.country_id}>{country.country_name}</option>})}
            </select>
        </>
        )
    }

    function inputField(type, name, value) {
        if (name == 'color') {
            return (
                <input
                    type={type}
                    name={name}
                    value={value}
                    onChange={handleInputChange}
                    data-tooltip-id={name}
                    disabled
                />
            );
        }

        return (
            <input
                type={type}
                name={name}
                value={value}
                onChange={handleInputChange}
                data-tooltip-id={name}
            />
        );
    }
    function handleEditClick(product) {
        setEditingProductId(product.id);
        delete product['country_name'];
        setEditedProduct(product)
    }
    function handleInputChange(e) {
        let { name, value } = e.target;
        if (name == 'weight_kg') {
            value = sanitizeNumeric(name, value, 1);
        }
        if (name == 'price') {
            value = sanitizeNumeric(name, value, 2);
        }
        setEditedProduct({ ...editedProduct, [name]: value });
    }
    function handleSaveClick(id) {
        updateProduct(id);
    }
    function sanitizeNumeric(name, value, precision) {
        let regex = /^([0-9]+)(\.)([0-9]*)$/;

        if (!regex.test(value)) {
            let ct = (value.match(/\./g) || []).length;
            if (value.match(/[^\d\.]/g) || ct > 1) {
                setTooltipState([name, "Format: " + String(Number(0).toFixed(precision))]);
                // Show tooltip for two seconds
                setIsOpen(true);
                setTimeout(() => {
                    setIsOpen(false)
                }, 2000);
            }

            value = value.replace(/[^\d\.]/g, '');

            let idx = value.indexOf('.');
            if (idx == 0) {
                value = '0' + value;
            }
            if (ct > 1) {
                value = value.slice(0, idx) + "." + value.slice(idx).replaceAll('.', '')
            }
        }
        let idx = value.indexOf('.');
        if (idx != -1 && value.slice(idx + 1).length > precision) {
            value = String(Number(value).toFixed(precision))
        }
        return value
    }

    // Color Picker
    const [selectedColor, setSelectedColor] = useState("#000000");
    function colorPicked() {
        let value = document.getElementById("colorPicker").value;
        setSelectedColor(value);
        editedProduct.color = value;
    }

    // Pagination
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className="product-management">

            <h3>Edit products</h3>
            {products.length > 0 ? (
                <div className="product-list">
                    {currentProducts.map((product) => (
                        <div key={product.id} className="product-item">
                            <img src={product.image_url} alt={product.product} className="product-image" />
                            <div className="product-details">
                                {editingProductId === product.id ? (
                                    <div>
                                        <p className='product-details-row'>
                                            <strong>Product Name:</strong>
                                            {inputField('text', 'product', editedProduct.product)}
                                        </p>

                                        <p className='product-details-row'>
                                            <strong>Production Country:</strong>
                                            {selectCountry(countries)}
                                        </p>

                                        <p className='product-details-row'>
                                            <strong>Color:</strong>
                                            <input type="color" value={editedProduct.color} name='color' id="colorPicker" onChange={() => colorPicked()} />
                                            {inputField('text', 'color', editedProduct.color)}
                                        </p>

                                        <p className='product-details-row'>
                                            <strong>Weight:</strong>
                                            {inputField('text', 'weight_kg', editedProduct.weight_kg)}
                                            <label>{WEIGHT_UNIT}</label>
                                        </p>

                                        <p className='product-details-row'>
                                            <strong>Price:</strong>
                                            {inputField('text', 'price', editedProduct.price)}
                                            <label>{editedProduct.price_currency}</label>
                                        </p>

                                        <button onClick={() => handleSaveClick(product.id)}>Save</button>
                                    </div>
                                ) : (
                                    <>
                                        <p><strong>Product Name:</strong> {product.product}</p>
                                        <p><strong>Production Country:</strong> {product.country_name}</p>
                                        <p><strong>Color:</strong>
                                            <span className='color-show' style={{display: 'inline-block', backgroundColor: product.color}}></span>
                                            {product.color}
                                        </p>
                                        <p><strong>Weight:</strong> {product.weight_kg ? product.weight_kg : 0} {WEIGHT_UNIT}</p>
                                        <p><strong>Price:</strong> {product.price} {product.price_currency}</p>
                                        <div className="button-group">
                                            <button onClick={() => handleEditClick(product)}>Edit</button>
                                            <button onClick={() => deleteProduct} className='button-disabled'>Delete</button>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p>There is no product data available</p>
            )}

            <button onClick={createProduct} className='button-disabled'>Add new Product</button>

            <div className="pagination">
                {Array.from({ length: Math.ceil(products.length / productsPerPage) }, (_, index) => (
                    <button key={index + 1} onClick={() => paginate(index + 1)}>
                        {index + 1}
                    </button>
                ))}
            </div>

            <Tooltip
                id={tooltipState[0]}
                content={tooltipState[1]}
                isOpen={isOpen}
            />
        </div>
    );
}

export default ProductPortfolioEditable;