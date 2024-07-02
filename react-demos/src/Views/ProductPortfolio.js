import React, { useState, useEffect, useRef } from 'react';
import { Tooltip } from 'react-tooltip';
import PaginationBar from '../Components/PaginationBar';
import SearchBar from '../Components/SearchBar';

const api_url = process.env.REACT_APP_BACKEND_API_URL;

// Development of this View has been abandoned ==> ProductPortfolioMerchant

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

    // Search filter hooks
    const [isFiltered, setIsFiltered] = useState(false)
    const [searchString, setSearchString] = useState('')
    const [filteredProducts, setFilteredProducts] = useState([])

    // Execution on initial loading: 1) HTTP requests to retreive data and 2) Initialization of filtered products
    useEffect(() => {
        getProducts();
        getCountries();
    }, []);

    // Current page parameters
    const indexOfLastProduct = Math.min(currentPage * productsPerPage, filteredProducts.length) - 1;
    const indexOfFirstProduct = Math.max(0, indexOfLastProduct - productsPerPage + 1)
    const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct + 1);


    // Helper functions
    function getProducts() {
        fetch(`${api_url}products`)
            .then(response => response.json())
            .then(data => saveProductData(data));
    }

    function saveProductData(data) {
        const products = data.map(data => {
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
        setProducts(products);
        setFilteredProducts(products);
    }

    function filterProducts(products, searchString, setFilteredFlag) {
        setSearchString(searchString);
        if (!searchString.trim()) {
            setFilteredFlag(false);
            setFilteredProducts(products);
        } else {
            setFilteredFlag(true);
            setFilteredProducts(products.filter(product => {
                for (let attribute in product) {
                    if (typeof product[attribute] === 'string') {
                        if (product[attribute].toLowerCase().includes(searchString.toLowerCase())) {
                            return true;
                        }
                    } else {
                        if (String(product[attribute]).toLowerCase().includes(searchString.toLowerCase())) {
                            return true;
                        }
                    }
                }
            }))
        }
    }

    function updateProduct(id) {
        fetch(`${api_url}products/${id}`, {
            method: 'PATCH',
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
        fetch(`${api_url}countries`)
            .then(response => response.json())
            .then(data => setCountries(data));
    }

    // Helper functions for editing a product
    function selectCountry(countries) {
        return (
            <select id="country_id" name="country_id" onChange={handleInputChange} value={editedProduct.country_id}>
                {countries.map((country, idx) => {
                    return (<option key={idx} value={country.country_id}>{country.country_name}</option>)
                })}
            </select>
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
        } else {
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

    // Callback functions
    function handleEditClick(product) {
        setEditingProductId(product.id);
        setEditedProduct(product);
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



    return (

        <div className='p-5'>
            <h3 className='p-2 pl-0 text-left'>
                Product Portfolio
            </h3>

            <div className='flex flex-row flex-wrap justify-center gap-4'>
                <SearchBar onInputChange={(val) => filterProducts(products, val, setIsFiltered)} />
            </div>

            <hr />

            <PaginationBar currentPage={currentPage} switchPageFn={setCurrentPage}
                startIdx={indexOfFirstProduct} endIdx={indexOfLastProduct}
                nProducts={filteredProducts.length} isFiltered={isFiltered} />

            {filteredProducts.length > 0 ? (
                <div className="product-list">
                    {currentProducts.map((product) => (
                        <div key={product.id} className="product-item">
                            <div className='w-full flex flex-shrink'>
                                {editingProductId === product.id ? (
                                    <div className='w-full flex flex-shrink gap-1'>
                                        <div className='flex-shrink'>
                                            <img src={product.image_url} alt={product.product_name} className="product-image" />
                                        </div>
                                        <div className='flex flex-col flex-grow'>
                                            <div align='left' className='float-left w-full'>
                                                <p className='product-details-row'>
                                                    <strong>Product ID:</strong> {product.id}
                                                </p>
                                                <p className='product-details-row'>
                                                    <strong>Product Name:</strong>
                                                    {inputField('text', 'product_name', editedProduct.product_name)}
                                                </p>

                                                <p className='product-details-row'>
                                                    <strong>Production&nbsp;Country:</strong>
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
                                            </div>
                                            <div className='flex flex-row-reverse gap-1'>
                                                <button onClick={() => handleSaveClick(product.id)} className='button-standard'>Save</button>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className='w-full flex flex-shrink gap-1'>
                                        <div className=''>
                                            <img src={product.image_url} alt={product.product_name} className="product-image" />
                                        </div>
                                        <div className='flex flex-col flex-grow'>
                                            <div align='left' className='float-left w-full'>
                                                <p><strong>Product ID:</strong> {product.id}</p>
                                                <p><strong>Product Name:</strong> {product.product_name}</p>
                                                <p><strong>Production&nbsp;Country:</strong> {product.country_name}</p>
                                                <p><strong>Color:</strong>
                                                    <span className='color-show' style={{ display: 'inline-block', backgroundColor: product.color }}></span>
                                                    {product.color}
                                                </p>
                                                <p><strong>Weight:</strong> {product.weight ? product.weight : '-'} {WEIGHT_UNIT}</p>
                                                <p><strong>Price:</strong> {product.price ? product.price : '-'} {product.price_currency}</p>
                                            </div>
                                            <div className="flex flex-row-reverse gap-1">
                                                <button onClick={() => handleEditClick(product)} className='button-standard'>Edit</button>
                                                <button onClick={() => { }} className='button-standard button-disabled' disabled
                                                    title="Deleting is not possible on this public portfolio page">Delete</button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p>No products were found.</p>
            )}

            <PaginationBar currentPage={currentPage} switchPageFn={setCurrentPage}
                startIdx={indexOfFirstProduct} endIdx={indexOfLastProduct}
                nProducts={filteredProducts.length} isFiltered={isFiltered} />

            <hr />

            {/* Overlay components */}
            <Tooltip id={tooltipState[0]}
                content={tooltipState[1]}
                isOpen={isOpen} />
        </div>
    );
}

export default ProductPortfolioEditable;