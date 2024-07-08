import React, { useState, useEffect, useRef } from 'react';
import { Tooltip } from 'react-tooltip';
import { useAuth0 } from "@auth0/auth0-react";
import axios from 'axios';
import $ from 'jquery';
import PaginationBar from '../Components/PaginationBar';
import SearchBar from '../Components/SearchBar';
import { ModalConfirmCancel } from '../Components/ModalConfirmCancel';
import { NotLoggedIn } from '../Components/Misc';
import NotificationBox from '../Components/NotificationBox';
import ModalCreateProduct from '../Components/ModalCreateProduct';
import Dropzone from '../Components/Dropzone';
import request from '../services/request-service';
import formatNumeric from '../lib/formatNumeric';

const api_url = process.env.REACT_APP_BACKEND_API_URL;

// Code needs a major overhaul
// - Refactoring of Components
// - Refactoring of certain functions

function ProductPortfolioMerchant() {
    // Auth0 hook
    const { user,
        isLoading,
    } = useAuth0();

    // General data hooks
    const [products, setProducts] = useState([]);
    const [countries, setCountries] = useState([]);

    // Pagination hooks and variables
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 20;

    // Constants for displaying
    const WEIGHT_UNIT = 'kg';

    // Editing hook
    const [editedProduct, setEditedProduct] = useState({});

    // Tooltip hooks
    const [tooltipIsOpen, setTooltipIsOpen] = useState(null);
    const [tooltipState, setTooltipState] = useState(['', '']); // [name of input field, tooltip text]

    // Search filter hooks
    const [isFiltered, setIsFiltered] = useState(false)
    const [searchString, setSearchString] = useState('')
    const [filteredProducts, setFilteredProducts] = useState([])

    // Delete hooks
    const [deleteOneModalIsOpen, setDeleteOneModalIsOpen] = useState(false);
    const [deleteAllModalIsOpen, setDeleteAllModalIsOpen] = useState(false);
    const [deleteModalText, setDeleteModalText] = useState('');
    const [productToDelete, setProductToDelete] = useState({});

    // Create hooks
    const [createModalIsOpen, setCreateModalIsOpen] = useState(false);

    // Notification hook and functionality
    const [notifications, setNotifications] = useState([])
    function addNotification(notification) {
        setNotifications([...notifications, [(notifications.length > 0) ? notifications[notifications.length - 1][0] + 1 : 0, notification]]);
    }

    // Loading (products) hook
    let [loading, setLoading] = useState(false);

    // Execution on initial loading
    useEffect(() => {
        if (user) {
            setLoading(true)
            getProducts();
            getCountries();
        }
    }, [user])

    // Apply filter whenever Array products changes
    useEffect(() => {
        filterProducts(products, searchString, setIsFiltered)
    }, [products]);

    // Conditional returns
    if (isLoading) {
        return null;
    }
    if ((!isLoading && !user)) {
        return <NotLoggedIn />
    }

    // Current page parameters
    const indexOfLastProduct = Math.min(currentPage * productsPerPage, filteredProducts.length) - 1;
    const indexOfFirstProduct = Math.max(0, indexOfLastProduct - productsPerPage + 1)
    const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct + 1);

    // API calls
    function getProducts() {
        const url = `${api_url}/merchant-products/${user.sub}`
        request.get(url)
            .then(response => {
                processProductData(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error(error);
            });
    }

    function updateProduct(p_id) {
        const url = `${api_url}/merchant-products/${user.sub}/${p_id}`;
        request.patch(url, editedProduct)
            .then(response => {
                let newProducts = [...products];
                newProducts[editedProduct.index] = { ...editedProduct }
                setProducts(newProducts);
                addNotification(`"${editedProduct.mp_name}" (ID: ${p_id}) modified.`);
                setEditedProduct({});
            })
            .catch(error => {
                console.error(error);
            });
    }

    function createProduct(body) {
        const url = `${api_url}/merchant-products/create`;
        request.post(url, body)
            .then(response => {
                try {
                    let newProducts = [...products, ...mapProductData(response.data)];
                    setProducts(newProducts);
                    setCurrentPage(Math.ceil(newProducts.length / productsPerPage));
                    window.scrollTo(0, document.body.scrollHeight);
                    addNotification(`Product "${response.data[0].mp_name}" (ID: ${response.data[0].mp_id}) created.`);
                } catch {
                    addNotification('Failed to create product. Please try again.');
                }
            })
            .catch(error => {
                console.error(error);
            });
    }

    function deleteProduct() {
        const url = `${api_url}/merchant-products/${user.sub}/${productToDelete.mp_id}`
        request.delete(url)
            .then(response => {
                let newProducts = [...products.filter(product => product.mp_id !== productToDelete.mp_id)];
                setProducts(newProducts);
                addNotification(`"${productToDelete.mp_name}" (ID: ${productToDelete.mp_id}) was deleted.`)
            })
            .catch(error => {
                console.error(error);
            });
    }

    function deleteAllProducts() {
        const url = `${api_url}/merchant-products/${user.sub}`
        request.delete(url)
            .then(response => {
                processProductData([]);
                addNotification(`All products were deleted.`)
            })
            .catch(error => {
                console.error(error);
            });
    }

    function initProducts() {
        const url = `${api_url}/merchant-products/${user.sub}/init`
        request.get(url) // This is a pseudo GET endpoint; It creates ressources without transmitting a body - The backend carries the rest of the information.
            .then(response => {
                processProductData(response.data);
                addNotification(`Added ${response.data.length} products.`);
            })
            .catch(error => {
                console.error(error);
            });
    }

    function getCountries() {
        const url = `${api_url}/countries`;
        request.get(url)
            .then(response => {
                setCountries(response.data);
            })
            .catch(error => {
                console.error(error);
            });
    }

    // Other functions
    function processProductData(data) {
        const newProducts = mapProductData(data)
        setProducts(newProducts);
    }

    function mapProductData(data) {
        const products = data.map(data => {
            return {
                mp_id: data.mp_id,
                mp_name: data.mp_name,
                mp_color: data.mp_color,
                mp_image_url: data.mp_image_url,
                mp_currency: data.mp_currency,
                mp_price: data.mp_price,
                mp_weight_kg: data.mp_weight_kg,
                mp_c_id_production: data.mp_c_id_production ? data.mp_c_id_production : -1,
            };
        });
        return (products);
    }

    function findCountryNameById(countries, c_id) {
        if (countries.length > 0) {
            let matchingCountry = countries.filter(country => country.c_id === c_id)[0]
            if (matchingCountry) {
                return matchingCountry.c_name;
            } else {
                return "";
            }
        } else {
            return "Loading...";
        }
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

    // Callback functions
    function handleEditClick(product) {
        setEditedProduct({ ...product, index: products.indexOf(product) });
    }

    function handleDeleteOneClick(product) {
        setDeleteOneModalIsOpen(true);
        setDeleteModalText(`Are you sure you want to delete the product "${product.mp_name}" (Product ID: ${product.mp_id})?`);
        setProductToDelete(product);
    }

    function handleSubmit(e) {
        e.preventDefault();
        let empty_var = null;
        updateProduct(editedProduct.mp_id);
    }

    function handleCancelClick() {
        setEditedProduct({});
    }

    function handleDeleteAllClick() {
        setDeleteAllModalIsOpen(true);
        setDeleteModalText(`Are you sure you want to delete all products?`);
    }

    function handleInputChanged(e) {
        let { id, value } = e.target;
        let tooltipAnchorId = null;
        let formatInfo = null;

        if (id == 'mp_weight_kg') {
            ({ value, formatInfo } = formatNumeric(value, 1));
            if (formatInfo !== '') tooltipAnchorId = id;
        } else if (id == 'mp_price') {
            ({ value, formatInfo } = formatNumeric(value, 2));
            if (formatInfo !== '') tooltipAnchorId = id;
        }

        if (tooltipAnchorId) {
            setTooltipState([tooltipAnchorId, formatInfo]);
            setTooltipIsOpen(true);
            setTimeout(() => {
                setTooltipIsOpen(false)
            }, 3500);
        }

        if (id == 'mp_c_id_production') {
            if (value == -1) {
                value = 'null';
            } else {
                value = parseInt(value);
            }
        }
        setEditedProduct({ ...editedProduct, [id]: value });
    }

    // Helper functions
    function selectCountry(countries) {
        return (
            <select id="mp_c_id_production" name="mp_c_id_production" onChange={handleInputChanged} value={editedProduct.mp_c_id_production}>
                <option value="-1">Choose country...</option>
                <option disabled>──────────</option>
                {countries.map((country, idx) => {
                    return (<option key={idx} value={country.c_id}>{country.c_name}</option>)
                })}
            </select>
        )
    }

    function inputField(type, id, value) {
        let disabled, required
        if (id == 'mp_color') {
            disabled = true
        } else {
            disabled = false
        }
        if (['mp_price', 'mp_weight_kg', 'mp_name'].includes(id)) {
            required = true
        } else {
            required = false
        }
        return (
            <input
                type={type}
                id={id}
                name={id}
                value={value}
                onChange={handleInputChanged}
                data-tooltip-id={id}
                disabled={disabled}
                required={required}
            />
        );
    }

    return (

        <div className='p-5'>
            <div className='flex flex-row justify-between'>
                <h3 className='p-2 pl-0 text-left'>
                    Retailer Product Portfolio
                </h3>

            </div>

            <div className='flex flex-row flex-wrap justify-start gap-4'>
                <button onClick={() => setCreateModalIsOpen(true)} className='button-new flex justify-between items-center my-auto'>
                    <span>+</span>
                    <span>New product</span>
                </button>

                <SearchBar onInputChange={(val) => filterProducts(products, val, setIsFiltered)} />
            </div>

            <hr />

            <PaginationBar currentPage={currentPage} switchPageFn={setCurrentPage}
                startIdx={indexOfFirstProduct} endIdx={indexOfLastProduct}
                nProducts={filteredProducts.length} isFiltered={isFiltered} />

            {filteredProducts.length > 0 ?
                (
                    <div className="product-list">
                        {currentProducts.map((product) => (
                            (editedProduct.mp_id === product.mp_id) ? (
                                <div key={product.mp_id} id="product-item-editing" className="product-item overflow-scroll w-full flex flex-col">
                                    <form onSubmit={handleSubmit}>
                                        <p className='product-details-row'>
                                            <strong>Product ID:</strong> {editedProduct.mp_id}
                                        </p>
                                        <div className='w-full flex flex-row flex-shrink gap-2 border-1 border-gray-600 p-2 rounded-sm mr-9'>
                                            <div className='product-details-row flex-grow flex flex-col'>
                                                <strong>Image</strong>
                                                <Dropzone uploadImage={() => { }} showLargeIcon={false} />
                                                <span className='pb-1 text-center'>OR</span>
                                                <div className='flex flex-row'>
                                                    <input type="textarea" rows="2" cols="5" id="mp_image_url" className='overflow-scroll h-40' placeholder="Enter or paste URL here (http://...)" />
                                                    <button type="button" onClick={() => { }} className='button-standard-inline pb-0.5'>Load</button>
                                                </div>
                                            </div>
                                            <div className='flex-shrink'>
                                                <img src={product.mp_image_url} alt={product.mp_name} className="product-image mt-1.5" />
                                            </div>
                                        </div>

                                        <p className='product-details-row'>
                                            <strong>Product Name:</strong>
                                            {inputField('text', 'mp_name', editedProduct.mp_name)}
                                        </p>

                                        <p className='product-details-row'>
                                            <strong>Production&nbsp;Country:</strong>
                                            {selectCountry(countries)}
                                        </p>

                                        <p className='product-details-row'>
                                            <strong>Color:</strong>
                                            &nbsp;&nbsp;Pick
                                            <input type="color" className='my-auto' value={editedProduct.mp_color} name='mp_color' id="colorPicker" onChange={handleInputChanged} />
                                            {inputField('text', 'mp_color', editedProduct.mp_color)}
                                        </p>

                                        <p className='product-details-row'>
                                            <strong>Weight:</strong>
                                            {inputField('text', 'mp_weight_kg', editedProduct.mp_weight_kg)}
                                            <label>{WEIGHT_UNIT}</label>
                                        </p>

                                        <p className='product-details-row'>
                                            <strong>Price:</strong>
                                            {inputField('text', 'mp_price', editedProduct.mp_price)}
                                            <label>{editedProduct.mp_currency}</label>
                                        </p>

                                        <div className='flex flex-row gap-1'>
                                            <button type='submit' className='button-standard'>Save</button>
                                            <button type='button' onClick={() => handleCancelClick()} className='button-standard-blue-grey'>Cancel</button>
                                        </div>

                                    </form>

                                </div>
                            ) : (
                                <div key={product.mp_id} className="product-item overflow-scroll w-full flex flex-row flex-shrink">
                                    <div className='flex flex-col flex-grow'>
                                        <div align='left' className='float-left w-full'>
                                            <p><strong>Product ID:</strong> {product.mp_id}</p>
                                            <p><strong>Product Name:</strong> {product.mp_name}</p>
                                            <p><strong>Production&nbsp;Country:</strong> {findCountryNameById(countries, product.mp_c_id_production)}</p>
                                            <p><strong>Color:</strong>
                                                <span className='color-show' style={{ display: 'inline-block', backgroundColor: product.mp_color }}></span>
                                                {product.mp_color}
                                            </p>
                                            <p><strong>Weight:</strong> {product.mp_weight_kg ? product.mp_weight_kg : '-'} {WEIGHT_UNIT}</p>
                                            <p><strong>Price:</strong> {product.mp_price ? product.mp_price : '-'} {product.mp_currency}</p>
                                        </div>
                                        <div className="flex flex-row gap-1">
                                            <button onClick={() => handleEditClick(product)} className='button-standard'>Edit</button>
                                            <button onClick={() => handleDeleteOneClick(product)} className='button-standard-blue-grey'>Delete</button>
                                        </div>
                                    </div>
                                    <div className=''>
                                        <img src={product.mp_image_url} alt={product.mp_name} className="product-image" />
                                    </div>
                                </div>
                            )
                        ))}
                    </div>
                ) : (
                    loading ?
                        <div align="center">Loading...</div> :
                        <div className='flex flex-col items-center gap-5' >
                            <p>
                                No products were found.
                            </p>
                            {products.length === 0 &&
                                <button onClick={() => initProducts()} className='button-standard w-64'>Create products with test data</button>
                            }
                        </div>
                )
            }

            <PaginationBar currentPage={currentPage} switchPageFn={setCurrentPage}
                startIdx={indexOfFirstProduct} endIdx={indexOfLastProduct}
                nProducts={filteredProducts.length} isFiltered={isFiltered} />

            <hr />

            {
                filteredProducts.length > 0 &&
                <div className='flex flex-row justify-center'>
                    <button onClick={() => handleDeleteAllClick()} className='button-standard-blue-grey'>Delete all products</button>
                </div>
            }

            {/* Overlay components */}
            <Tooltip id={tooltipState[0]}
                content={tooltipState[1]}
                isOpen={tooltipIsOpen} />

            <ModalConfirmCancel isShown={deleteOneModalIsOpen} title='Confirm deletion' text={deleteModalText}
                onConfirm={() => { deleteProduct(); setDeleteOneModalIsOpen(false); }} onCancel={() => { setDeleteOneModalIsOpen(false) }} />

            <ModalConfirmCancel isShown={deleteAllModalIsOpen} title='Confirm deletion' text={deleteModalText}
                onConfirm={() => { deleteAllProducts(); setDeleteAllModalIsOpen(false); }} onCancel={() => { setDeleteAllModalIsOpen(false) }} />

            <ModalCreateProduct isShown={createModalIsOpen} countries={countries}
                onClose={() => setCreateModalIsOpen(false)} onSubmit={createProduct} />

            <NotificationBox notifications={notifications} setNotifications={setNotifications} className='fixed flex flex-col gap-1 top-16 w-1/2 right-4' />
        </div >
    );
}

export default ProductPortfolioMerchant