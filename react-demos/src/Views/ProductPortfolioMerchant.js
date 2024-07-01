import React, { useState, useEffect, useRef } from 'react';
import { Tooltip } from 'react-tooltip';
import PaginationBar from '../Components/PaginationBar';
import SearchBar from '../Components/SearchBar';
import { useAuth0 } from "@auth0/auth0-react";
import { ModalConfirmCancel } from '../Components/Modal';

function ProductPortfolioMerchant() {
    const { user, isLoading } = useAuth0();

    // General data hooks
    const [products, setProducts] = useState([]);
    const [countries, setCountries] = useState([]);

    // Pagination hooks and variables
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 20;

    // Constants for displaying
    const WEIGHT_UNIT = 'kg';

    // Editing hooks
    const [editedProduct, setEditedProduct] = useState({});

    // Tooltip hooks
    const [tooltipIsOpen, setTooltipIsOpen] = useState(null);
    const [tooltipState, setTooltipState] = useState(['', '']); // [name of input field, tooltip text]

    // Search filter hooks
    const [isFiltered, setIsFiltered] = useState(false)
    const [searchString, setSearchString] = useState('')
    const [filteredProducts, setFilteredProducts] = useState([])

    // Hook for color picker
    const [selectedColor, setSelectedColor] = useState("#000000");

    // Delete hooks
    const [deleteOneModalIsOpen, setDeleteOneModalIsOpen] = useState(false);
    const [deleteAllModalIsOpen, setDeleteAllModalIsOpen] = useState(false);
    const [deleteModalText, setDeleteModalText] = useState('');
    const [productToDelete, setProductToDelete] = useState({});

    // Execution on initial loading: 1) HTTP requests to retreive data and 2) Initialization of filtered products
    useEffect(() => {
        getProducts();
        getCountries();
    }, [user]);

    // Apply filter whenever Array products changes
    useEffect(() => {
        filterProducts(products, searchString, setIsFiltered)
    }, [products]);

    if (isLoading || (!isLoading && !user)) {
        return null;
    }

    // Current page parameters
    const indexOfLastProduct = Math.min(currentPage * productsPerPage, filteredProducts.length) - 1;
    const indexOfFirstProduct = Math.max(0, indexOfLastProduct - productsPerPage + 1)
    const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct + 1);

    // Helper functions
    function getProducts() {
        if (!user) return;
        fetch('http://localhost:3001/merchant-products/' + user.sub)
            .then(response => response.json())
            .catch(error => console.log(error))
            .then(data => processProductData(data));
    }

    function processProductData(data) {
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

    function updateProduct(product_id) {
        fetch(`http://localhost:3001/merchant-products/${user.sub}/${product_id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(editedProduct),
        })
            .then(response => response.text())
            .then(data => {
                setEditedProduct({});
                getProducts();
            });
    }

    function createProduct() {
        return null
    }

    function deleteProduct() {
        fetch(`http://localhost:3001/merchant-products/${user.sub}/${productToDelete.id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({}),
        })
            .then(response => response.text())
            .catch(error => console.log(error))
            .then(notification => {
                //process-notification
                getProducts();
            });
    }

    function deleteAllProducts() {
        fetch(`http://localhost:3001/merchant-products/${user.sub}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({}),
        })
            .then(response => response.json())
            .catch(error => console.log(error))
            .then(notification => {
                //process-notification
                getProducts();
            });
    }

    function initProducts() {
        fetch(`http://localhost:3001/merchant-products/${user.sub}/init`, {
            method: 'POST', // Pseudo POST endpoint
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({}),
        })
            .then(response => response.json())
            .catch(error => console.log(error))
            .then(data => processProductData(data));
    }

    function getCountries() {
        // fetch('http://localhost:3010/api/vercel/countries')
        fetch('http://localhost:3001/countries')
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
                setTooltipIsOpen(true);
                setTimeout(() => {
                    setTooltipIsOpen(false)
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
    function colorPicked() {
        let value = document.getElementById("colorPicker").value;
        setSelectedColor(value);
        editedProduct.color = value;
    }

    // Callback functions
    function handleEditClick(product) {
        setEditedProduct(product)
    }

    function handleDeleteOneClick(product) {
        setDeleteOneModalIsOpen(true);
        setDeleteModalText(`Are you sure you want to delete the product "${product.product_name}" (Product ID: ${product.id})?`);
        setProductToDelete(product);
    }

    function handleSaveClick(product_id) {
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
            setTooltipIsOpen(true);
            setTimeout(() => {
                setTooltipIsOpen(false)
            }, 2000);
        } else {
            updateProduct(product_id);
        }
    }

    function handleCancelClick() {
        setEditedProduct({});
    }

    function handleDeleteAllClick(product) {
        setDeleteAllModalIsOpen(true);
        setDeleteModalText(`Are you sure you want to delete all products?`);
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

    return (

        <div className='p-5'>
            <h3 className='p-2 pl-0 text-left'>
                Retailer Product Portfolio
            </h3>

            <div className='pt-2 pb-2'>
                <button onClick={createProduct} className='button-standard button-disabled' disabled>Add new Product</button>
            </div>

            <SearchBar onInputChange={(val) => filterProducts(products, val, setIsFiltered)} />

            <PaginationBar currentPage={currentPage} switchPageFn={setCurrentPage}
                startIdx={indexOfFirstProduct} endIdx={indexOfLastProduct}
                nProducts={filteredProducts.length} isFiltered={isFiltered} />

            {filteredProducts.length > 0 ?
                (
                    <div className="product-list">
                        {currentProducts.map((product) => (
                            <div key={product.id} className="product-item">
                                <div className='w-full flex flex-shrink'>
                                    {editedProduct === product ? (
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
                                                    <button onClick={() => handleCancelClick()} className='button-standard-blue-grey'>Cancel</button>
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
                                                    <button onClick={() => handleDeleteOneClick(product)} className='button-standard-blue-grey'>Delete</button>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) :
                (
                    <div className="flex flex-col gap-5">
                        <p>No products were found.</p>
                        <button onClick={() => initProducts()} className='button-standard w-64'>Create products with test data</button>
                    </div>
                )}

            <PaginationBar currentPage={currentPage} switchPageFn={setCurrentPage}
                startIdx={indexOfFirstProduct} endIdx={indexOfLastProduct}
                nProducts={filteredProducts.length} isFiltered={isFiltered} />

            <div className='pt-2 pb-2'>
                <button onClick={() => handleDeleteAllClick()} className='button-standard-blue-grey'>Delete all products</button>
            </div>

            {/* Overlay components */}
            <Tooltip id={tooltipState[0]}
                content={tooltipState[1]}
                tooltipIsOpen={tooltipIsOpen} />

            <ModalConfirmCancel isShown={deleteOneModalIsOpen} title='Confirm deletion' text={deleteModalText}
                onConfirm={() => {deleteProduct(); setDeleteOneModalIsOpen(false);}} onCancel={() => { setDeleteOneModalIsOpen(false) }} />

            <ModalConfirmCancel isShown={deleteAllModalIsOpen} title='Confirm deletion' text={deleteModalText}
                onConfirm={() => {deleteAllProducts(); setDeleteAllModalIsOpen(false);}} onCancel={() => { setDeleteAllModalIsOpen(false) }} />
        </div>
    );
}

export default ProductPortfolioMerchant