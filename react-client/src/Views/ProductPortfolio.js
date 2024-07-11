import React, { useState, useEffect, useRef } from 'react';
import { Tooltip } from 'react-tooltip';
import PaginationBar from '../Components/PaginationBar';
import SearchBar from '../Components/SearchBar';
import NotificationContainer from '../Components/NotificationContainer';
import request from '../Services/request-service';

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

    // Notification hook and functionality
    const [notifications, setNotifications] = useState([])
    function addNotification(notification) {
        setNotifications([...notifications, [(notifications.length > 0) ? notifications[notifications.length - 1][0] + 1 : 0, notification]]);
    }

    // Loading (products) hook
    let [loading, setLoading] = useState(false);

    // Execution on initial loading: 1) HTTP requests to retreive data and 2) Initialization of filtered products
    useEffect(() => {
        setLoading(true);
        getProducts();
        getCountries();
    }, []);

    useEffect(() => {
        filterProducts(products, searchString, setIsFiltered)
    }, [products]);

    // Current page parameters
    const indexOfLastProduct = Math.min(currentPage * productsPerPage, filteredProducts.length) - 1;
    const indexOfFirstProduct = Math.max(0, indexOfLastProduct - productsPerPage + 1)
    const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct + 1);

    // API calls
    function getProducts() {
        const url = `${api_url}/products`
        request.get(url)
            .then(response => {
                saveProductData(response.data);
                setLoading(false)
            })
            .catch(error => {
                console.error(error);
            });
    }

    function updateProduct(p_id) {
        const body = { ...editedProduct, ['p_c_id_production']: editedProduct.p_c_id_production != 'null' ? editedProduct.p_c_id_production : null };
        const url = `${api_url}/products/${p_id}`

        request.patch(url, body)
            .then(response => {
                setEditingProductId(null);
                let newProducts = [...products];
                newProducts[editedProduct.index] = { ...editedProduct }
                setProducts(newProducts);
                addNotification(`"${editedProduct.p_name}" (ID: ${p_id}) modified.`);
            })
            .catch(error => {
                console.error(error);
            });
    }

    function getCountries() {
        const url = `${api_url}/countries`
        request.get(url)
            .then(response => {
                setCountries(response.data);
            })
            .catch(error => {
                console.error(error);
            });
    }

    function saveProductData(data) {
        const products = data.map(data => {
            return {
                p_id: data.p_id,
                p_name: data.p_name,
                p_color: data.p_color,
                p_image_url: data.p_image_url,
                p_currency: data.p_currency,
                p_price: data.p_price,
                p_weight_kg: data.p_weight_kg,
                p_c_id_production: data.p_c_id_production,
                c_name: data.c_name,
            };
        });
        setProducts(products);
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

    // Helper functions for editing a product
    function selectCountry(countries) {
        return (
            <select id="p_c_id_production" name="p_c_id_production" onChange={handleInputChange} value={editedProduct.p_c_id_production}>
                <option value="null">Choose country...</option>
                <option disabled>──────────</option>
                {countries.map((country, idx) => {
                    return (<option key={idx} value={country.c_id}>{country.c_name}</option>)
                })}
            </select>
        )
    }

    function inputField(type, name, value) {
        if (name == 'p_color') {
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
        editedProduct.p_color = value;
    }

    // Callback functions
    function handleEditClick(product) {
        setEditingProductId(product.p_id);
        setEditedProduct({ ...product, index: products.indexOf(product) });
    }

    function handleInputChange(e) {
        let { name, value } = e.target;
        if (name == 'p_weight_kg') {
            value = sanitizeNumeric(name, value, 1);
        }
        if (name == 'p_price') {
            value = sanitizeNumeric(name, value, 2);
        }
        setEditedProduct({ ...editedProduct, [name]: value });
    }

    function handleSaveClick(e, p_id) {
        e.preventDefault();
        let empty_var = null
        if (!editedProduct.p_name) {
            empty_var = 'Product Name'
        } else if (!editedProduct.p_weight_kg) {
            empty_var = 'Weight'
        } else if (!editedProduct.p_price) {
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
            updateProduct(p_id);
        }
    }

    function handleCancelClick() {
        setEditingProductId(null);
        setEditedProduct({});
    }

    return (

        <div className='p-5'>
            <h3 className='p-2 pl-0 text-left'>
                Product Portfolio
            </h3>

            <div className='flex flex-row flex-wrap justify-start gap-4'>
                <SearchBar onInputChange={(val) => filterProducts(products, val, setIsFiltered)} />
            </div>

            <div className='hr' />

            <PaginationBar currentPage={currentPage} switchPageFn={setCurrentPage}
                startIdx={indexOfFirstProduct} endIdx={indexOfLastProduct}
                nProducts={filteredProducts.length} isFiltered={isFiltered} />

            {filteredProducts.length > 0 ? (
                <div className="product-list">
                    {currentProducts.map((product) => (
                        <div key={product.p_id} className="product-item">
                            <div className='w-full flex flex-shrink'>
                                {editingProductId === product.p_id ? (
                                    <form onSubmit={(e) => {
                                        handleSaveClick(e, product.p_id);
                                    }}>
                                        <div className='w-full flex flex-shrink gap-1'>
                                            <div className='flex-shrink'>
                                                <img src={product.p_image_url} alt={product.p_name} className="product-image" />
                                            </div>
                                            <div className='flex flex-col'>
                                                <div align='left' className='w-full'>
                                                    <p className='product-details-row'>
                                                        <strong>Product ID:</strong> {product.p_id}
                                                    </p>

                                                    <p className='product-details-row'>
                                                        <strong>Product Name:</strong>
                                                        {inputField('text', 'p_name', editedProduct.p_name)}
                                                    </p>

                                                    <p className='product-details-row'>
                                                        <strong>Production&nbsp;Country:</strong>
                                                        {selectCountry(countries)}
                                                    </p>

                                                    <p className='product-details-row'>
                                                        <strong>Color:</strong>
                                                        &nbsp;&nbsp;Pick
                                                        <input type="color" value={editedProduct.p_color} name='p_color' id="colorPicker" onChange={() => colorPicked()} />
                                                        {inputField('text', 'p_color', editedProduct.p_color)}
                                                    </p>

                                                    <p className='product-details-row'>
                                                        <strong>Weight:</strong>
                                                        {inputField('text', 'p_weight_kg', editedProduct.p_weight_kg)}
                                                        <label>{WEIGHT_UNIT}</label>
                                                    </p>

                                                    <p className='product-details-row'>
                                                        <strong>Price:</strong>
                                                        {inputField('text', 'p_price', editedProduct.p_price)}
                                                        <label>{editedProduct.p_currency}</label>
                                                    </p>
                                                </div>
                                                <div className='flex flex-row-reverse gap-1'>
                                                    <button type='submit' onClick={(e) => handleSaveClick(e, product.p_id)} className='button-standard'>Save</button>
                                                    <button type='button' onClick={() => handleCancelClick()} className='button-standard-blue-grey'>Cancel</button>
                                                </div>
                                            </div>
                                        </div>
                                    </form>
                                ) : (
                                    <div className='w-full flex flex-shrink gap-1'>
                                        <div className=''>
                                            <img src={product.p_image_url} alt={product.p_name} className="product-image" />
                                        </div>
                                        <div className='flex flex-col flex-grow'>
                                            <div align='left' className='float-left w-full'>
                                                <p><strong>Product ID:</strong> {product.p_id}</p>
                                                <p><strong>Product Name:</strong> {product.p_name}</p>
                                                <p><strong>Production&nbsp;Country:</strong> {product.c_name}</p>
                                                <p><strong>Color:</strong>
                                                    <span className='color-show' style={{ display: 'inline-block', backgroundColor: product.p_color }}></span>
                                                    {product.p_color}
                                                </p>
                                                <p><strong>Weight:</strong> {product.p_weight_kg ? product.p_weight_kg : '-'} {WEIGHT_UNIT}</p>
                                                <p><strong>Price:</strong> {product.p_price ? product.p_price : '-'} {product.p_currency}</p>
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
                <div align="center">{loading ? 'Loading...' : 'No products were found.'}</div>
            )}

            <PaginationBar currentPage={currentPage} switchPageFn={setCurrentPage}
                startIdx={indexOfFirstProduct} endIdx={indexOfLastProduct}
                nProducts={filteredProducts.length} isFiltered={isFiltered} />

            <div className='hr' />

            {/* Overlay components */}
            <Tooltip id={tooltipState[0]}
                content={tooltipState[1]}
                isOpen={isOpen} />

            <NotificationContainer notifications={notifications} setNotifications={setNotifications} className='fixed flex flex-col gap-1 top-20 w-1/2 right-2' />

        </div>
    );
}

export default ProductPortfolioEditable;