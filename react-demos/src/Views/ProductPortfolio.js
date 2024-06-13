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
                product_name: data.product_name,
                color: data.color,
                image_url: data.image_url,
                price_currency: data.price_currency,
                price: data.price,
                weight: data.weight_kg,
                country_id: data.country_id,
                country_name: data.country_name,
            };
        });
        setProducts(filteredData);
    }

    function updateProduct(id) {
        console.log(editedProduct)
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
                    {countries.map((country, idx) => {
                        if (editedProduct.country_id == country.country_id) {
                            return (<option key={idx} value={country.country_id} selected>{country.country_name}</option>);
                        } else {
                            return (<option key={idx} value={country.country_id}>{country.country_name}</option>);
                        }
                    })}
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
        if (name == 'weight') {
            value = sanitizeNumeric(name, value, 1);
        }
        if (name == 'price') {
            value = sanitizeNumeric(name, value, 2);
        }
        setEditedProduct({ ...editedProduct, [name]: value });
    }
    function handleSaveClick(id) {
        let empty_var = null
        if (!editedProduct.product_name) {
            empty_var = 'Product Name'
        } else if (!editedProduct.weight) {
            empty_var = 'Weight'
        } else if (!editedProduct.price) {
            empty_var = 'Price'
        }
        if (empty_var) {
            setTooltipState([empty_var.replace(" ", "_").toLowerCase(), empty_var + " cannot be empty"]);
            // Show tooltip for two seconds
            setIsOpen(true);
            setTimeout(() => {
                setIsOpen(false)
            }, 2000);
        } else {
            updateProduct(id);
        }
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
                }, 5000);
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
    useEffect(() => {
        console.log(products.length)
    })
    const indexOfLastProduct = Math.min(currentPage * productsPerPage, products.length);
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);
    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
    }
    const paginationDisplayArray = () => {
        let Npages = Math.ceil(products.length / productsPerPage)
        let s = new Set([Npages, currentPage + 20, currentPage + 10, currentPage + 2, currentPage + 1, currentPage, currentPage - 1, currentPage - 2, currentPage - 10, currentPage - 20, 1])
        let a = Array.from(s).sort((a, b) => (a - b));
        return a.filter(x => x > 0 && x <= Npages)
    }

    return (
        <div className='p-5'>
            <h3 className='p-2'>Editable product portfolio</h3>
            {products.length > 0 ? (
                <div className="product-list">
                    {currentProducts.map((product) => (
                        <div key={product.id} className="product-item">
                            <img src={product.image_url} alt={product.product_name} className="product-image" />
                            <div className="product-details">
                                {editingProductId === product.id ? (
                                    <div className=''>
                                        <p>
                                            <strong>Product Number:</strong> {product.id}
                                        </p>
                                        <p className='product-details-row'>
                                            <strong>Product Name:</strong>
                                            {inputField('text', 'product_name', editedProduct.product_name)}
                                        </p>

                                        <p className='product-details-row'>
                                            <strong>Production Country:</strong>
                                            {selectCountry(countries)}
                                        </p>

                                        <p className='product-details-row'>
                                            <strong>Color:</strong>
                                            &nbsp;&nbsp;Choose
                                            <input type="color" value={editedProduct.color} name='color' id="colorPicker" onChange={() => colorPicked()} />
                                            Code
                                            {inputField('text', 'color', editedProduct.color)}
                                        </p>

                                        <p className='product-details-row'>
                                            <strong>Weight:</strong>
                                            {inputField('text', 'weight', editedProduct.weight)}
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
                                    <div className='gap-y-20'>
                                        <p><strong>Product Number:</strong> {product.id}</p>
                                        <p><strong>Product Name:</strong> {product.product_name}</p>
                                        <p><strong>Production Country:</strong> {product.country_name}</p>
                                        <p><strong>Color:</strong>
                                            <span className='color-show' style={{ display: 'inline-block', backgroundColor: product.color }}></span>
                                            {product.color}
                                        </p>
                                        <p><strong>Weight:</strong> {product.weight ? product.weight : '-'} {WEIGHT_UNIT}</p>
                                        <p><strong>Price:</strong> {product.price ? product.price : '-'} {product.price_currency}</p>
                                        <div className="button-group">
                                            <button onClick={() => handleEditClick(product)}>Edit</button>
                                            <button onClick={() => deleteProduct} className='button-disabled'>Delete</button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p>There is no product data available</p>
            )}

            <div className="pagination">
                {/* {Array.from({ length: Math.ceil(products.length / productsPerPage) }, (_, index) => (
                    <button key={index + 1} onClick={() => paginate(index + 1)}>
                        {index + 1}
                    </button>
                ))} */}
                {paginationDisplayArray().map(idx => {
                    if (idx == currentPage) {
                        return (<button key={idx} onClick={() => paginate(idx)} className='pagination-active'>
                            Page {idx}
                        </button>)
                    } else {
                        return (<button key={idx} onClick={() => paginate(idx)}>
                            {idx}
                        </button>)
                    }
                })}
            </div>

            <Tooltip
                id={tooltipState[0]}
                content={tooltipState[1]}
                isOpen={isOpen}
            />
            <div className='margin-top-20'>
                <button onClick={createProduct} className='button-disabled'>Add new Product</button>
            </div>
        </div>
    );
}

export default ProductPortfolioEditable;