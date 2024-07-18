import React, { useState, useEffect, useMemo } from 'react';
import { Navigate, useNavigate, useLocation } from 'react-router-dom';
import { Tooltip } from 'react-tooltip';
import { useAuth0 } from "@auth0/auth0-react";
import axios from 'axios';
import $ from 'jquery';
import { MoonLoader } from 'react-spinners';
import deepEqual from 'deep-equal';
import PaginationBar from '../Components/PaginationBar';
import SearchBar from '../Components/SearchBar';
import { ModalConfirmCancel } from '../Components/ModalConfirmCancel';
import { NotLoggedIn } from '../Components/Misc';
import NotificationContainer from '../Components/NotificationContainer';
import ModalCreateProduct from '../Components/ModalCreateProduct';
import Dropzone from '../Components/Dropzone';
import ProgressBar from '../Components/ProgressBar';
import request from '../Services/request-service';
import formatNumeric from '../Utils/formatNumeric';
import uploadImage from '../Utils/uploadImage';
import verifyUrlImage from '../Utils/verifyUrlImage';
import { hexToRgb } from '../Utils/generic';
import config from '../config';

const api_url = process.env.REACT_APP_BACKEND_API_URL;
const publicTestUserNickname = process.env.REACT_APP_PUBLIC_TEST_USER;

// Code needs a major overhaul
// - Refactoring of Components
// - Refactoring of certain functions

const ProductPortfolioMerchant = (props) => {
    // Public test mode (Props does not work for this component for an unknown reason)
    const [publicTestMode, setPublicTestMode] = useState(false)

    // Auth0 hook
    const { user, isLoading } = useAuth0();

    // API connection and response
    const [databaseConnectionFailed, setDatabaseConnectionFailed] = useState(false);
    const [waitingForResponse, setWaitingForReponse] = useState(false);

    // Navigation
    const navigate = useNavigate();
    const location = useLocation();

    // State for switching between public test mode user and actually logged in user
    const [usedUser, setUsedUser] = useState(null);

    //// Variables, hooks, and basic functionality
    // Data from API calls
    const [products, setProducts] = useState([]);
    const [countries, setCountries] = useState([]);

    // Editing
    const [editedProduct, setEditedProduct] = useState({});
    const [editedIndex, setEditedIndex] = useState(-1);

    // Image
    const [manualImageUrl, setManualImageUrl] = useState(''); // Manually input image url
    const [previewImageButtonEnabled, setPreviewImageButtonEnabled] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(-1);

    // Tooltip
    const [tooltipIsOpen, setTooltipIsOpen] = useState(false);
    const [tooltipState, setTooltipState] = useState(['', '']); // [name of input field, tooltip text]

    // Search filter
    const [searchString, setSearchString] = useState('')
    const isFiltered = useMemo(() => { return !!searchString.trim() }, [searchString])
    const filteredProducts = useMemo(filterProducts, [searchString, products])

    // Deleting
    const [deleteOneModalIsOpen, setDeleteOneModalIsOpen] = useState(false);
    const [deleteAllModalIsOpen, setDeleteAllModalIsOpen] = useState(false);
    const [deleteModalText, setDeleteModalText] = useState('');
    const [productToDelete, setProductToDelete] = useState({});

    // Dismissing changes
    const [pendingActionOnDismiss, setPendingActionOnDismiss] = useState(() => () => { return false; });
    const [dismissModalIsOpen, setDismissModalIsOpen] = useState(false);
    const dismissModalText = `Are you sure you want to dismiss your unsaved changes to the product "${editedProduct.mp_name}" (Product ID: ${editedProduct.mp_id})?`

    // Creating (products)
    const [createModalIsOpen, setCreateModalIsOpen] = useState(false);
    const maxProductsReached = (products.length >= config.maxProductsReached);

    // Notification
    const [notifications, setNotifications] = useState([])

    // Pagination
    const [currentPage, setCurrentPage] = useState(1); // (!) starting at 1 
    const productsPerPage = 20;
    const nPages = Math.ceil(filteredProducts.length / productsPerPage);
    const indexLastProduct = Math.min(currentPage * productsPerPage, filteredProducts.length) - 1;
    const indexFirstProduct = Math.max(0, (currentPage - 1) * productsPerPage)
    const currentProducts = filteredProducts.slice(indexFirstProduct, indexLastProduct + 1);

    // Other
    const WEIGHT_UNIT = 'kg';

    //// Effects
    // Check for public test mode, since props do not work for an unknown reason
    useEffect(() => {
        const pathParts = location.pathname.split('/');
        setPublicTestMode(pathParts[pathParts.length - 1] == 'public-test-mode')
    }, [location.pathname])

    // Use actually logged in user, or public test mode user, or use falsy user
    useEffect(() => {
        if (user) {
            setUsedUser(user)
            // Public test mode is not intended for logged in users
            if (publicTestMode) {
                addNotification('Automatically left public test mode (You are logged in).')
                navigate(".");
            }
        } else if (publicTestMode) {
            setUsedUser({ 'sub': publicTestUserNickname })
        } else { // Here, usedUser is falsy
            setUsedUser(user)
        }
    }, [user, publicTestMode])

    // Loading data
    useEffect(() => {
        if (usedUser) {
            getProducts();
            getCountries();
        }
    }, [usedUser])

    // Pagination: Go back one page if current page is greater than number of pages
    useEffect(() => {
        if (currentPage > nPages) {
            setCurrentPage(Math.max(currentPage - 1, 1))
        }
    }, [filteredProducts]);

    // Pagination: Go back to first page when search string changes
    useEffect(() => {
        setCurrentPage(1)
    }, [searchString])

    // Verify image url whenever imageUrl changes to value unequal to ''
    useEffect(() => {
        let imageUrl = editedProduct.mp_image_url
        async function doAsync() {
            const isValid = await verifyUrlImage(imageUrl);
            if (!isValid) {
                setEditedProduct({ ...editedProduct, mp_image_url: 'invalid' });
                console.log('Invalid image url');
            }
        }
        if (imageUrl) doAsync();
    }, [editedProduct.mp_image_url]);

    // Dismiss changes
    // useEffect(() => {
    //     console.log("called");
    //     if (unsavedChanges() && !pendingActionOnDismiss()) {
    //         setDismissModalIsOpen(true)
    //         setPendingActionOnDismiss(() => () => {
    //             setEditedProduct({})
    //             setEditedIndex(-1)
    //             return true
    //         })
    //     }
    // }, [unsavedChanges()])

    // Hide tooltip after appearTimeTooltip milliseconds
    const appearTimeTooltip = 3500;
    useEffect(() => {
        if (tooltipIsOpen) setTimeout(() => setTooltipIsOpen(false), appearTimeTooltip)
    }, [tooltipIsOpen])

    //// Conditional returns
    if (isLoading || waitingForResponse) {
        return (
            <div className='flex flex-col items-center pt-7'>
                <MoonLoader speedMultiplier={0.3} color='rgb(15 23 42)' />
            </div>
        )
    }
    if (databaseConnectionFailed) {
        return (
            <div className='flex flex-col items-center pt-7'>
                <div>Failed to connect to the database. Please try again later.</div>
            </div>
        )
    }
    if ((!isLoading && !usedUser)) {
        return (
            <div className='flex flex-col items-center gap-3'>
                <NotLoggedIn />
                <div>
                    For demonstration purposes, you can access the <strong>public portfolio</strong> (non-personalized) by clicking the button below.
                </div>
                <button type="button" onClick={() => { navigate("public-test-mode") }} className='button-test-mode'>
                    Enter Public Test Mode
                </button>
            </div>
        )
    }


    //// API calls

    function getProducts() {
        const url = `${api_url}/merchant-products/${usedUser.sub}`
        const controller = new AbortController();

        setWaitingForReponse(true);

        setTimeout(() => {
            controller.abort("Timeout")
        }, 10000)

        const { signal } = controller;

        request.get(url, { signal })
            .then(response => {
                processProductData(response.data);
                //console.log(JSON.stringify(response.data));
            })
            .catch(error => {
                console.error(error);
                setDatabaseConnectionFailed(true);
            })
            .finally(() => {
                setWaitingForReponse(false);
            });
    }

    function updateProduct(p_id) {

        const body = { ...editedProduct, ['mp_c_id_production']: editedProduct.mp_c_id_production != 'null' ? editedProduct.mp_c_id_production : null };
        const url = `${api_url}/merchant-products/${usedUser.sub}/${p_id}`;

        request.patch(url, body)
            .then(response => {
                let newProducts = [...products];
                newProducts[editedIndex] = response.data[0];
                setProducts(newProducts);
                addNotification(`"${editedProduct.mp_name}" (ID: ${p_id}) modified.`);
                setEditedProduct({});
            })
            .catch(error => {
                addNotification(`"Error. ${editedProduct.mp_name}" (ID: ${p_id}) not modified.`);
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
                addNotification('Failed to create product. Please try again.');
                console.error(error);
            });
    }

    function deleteProduct() {
        const url = `${api_url}/merchant-products/${usedUser.sub}/${productToDelete.mp_id}`
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
        const url = `${api_url}/merchant-products/${usedUser.sub}`
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
        const url = `${api_url}/merchant-products/${usedUser.sub}/init`
        request.post(url) // This is a pseudo POST endpoint; It creates ressources without transmitting a body - The backend carries the rest of the information.
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
                setDatabaseConnectionFailed(true);
            });
    }

    //// Helper functions
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
                mp_c_id_production: data.mp_c_id_production ? data.mp_c_id_production : "null",
                c_name: data.c_name,
            };
        });
        return (products);
    }

    // function findCountryNameById(countries, c_id) {
    //     if (countries.length > 0) {
    //         let matchingCountry = countries.filter(country => country.c_id === c_id)[0]
    //         if (matchingCountry) {
    //             return matchingCountry.c_name;
    //         } else {
    //             return "";
    //         }
    //     } else {
    //         return "Loading...";
    //     }
    // }

    function filterProducts() {
        if (!isFiltered) {
            return products;
        } else {
            return (products.filter(product => {
                for (let attribute in product) {
                    if (String(product[attribute]).toLowerCase().includes(searchString.toLowerCase())) {
                        return true;
                    }
                }
                if (product.mp_id == editedProduct.mp_id) {
                    return true;
                }
            }))
        }
    }

    const unsavedChanges = () => {
        return (Object.keys(editedProduct).length > 0 && !deepEqual(editedProduct, products[editedIndex]))
    }


    //// Callback functions
    function handleEditClick(product, force = false) {
        if (force == false && unsavedChanges()) {
            // Open modal if usedUser is usedUser has unsaved changes on a product
            setPendingActionOnDismiss(() => () => startEditingProduct(product));
            setDismissModalIsOpen(true);
        } else {
            startEditingProduct(product);
        }
    }

    function handleDeleteOneClick(product) {
        setDeleteModalText(`Are you sure you want to delete the product "${product.mp_name}" (Product ID: ${product.mp_id})?`);
        setDeleteOneModalIsOpen(true);
        setProductToDelete(product);
    }

    function handleSubmit(e) {
        e.preventDefault();
        if (!deepEqual(editedProduct, products[editedIndex])) {
            updateProduct(editedProduct.mp_id);
        } else {
            addNotification(`"${editedProduct.mp_name}" (ID: ${editedProduct.mp_id}) unchanged.`);
            setEditedProduct({});
        }
    }

    function handleCancelClick() {
        setEditedProduct({});
    }

    function handleDeleteAllClick() {
        setDeleteModalText(`Are you sure you want to delete all products?`);
        setDeleteAllModalIsOpen(true);
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
        }
        setEditedProduct({ ...editedProduct, [id]: value });
    }

    function handleManualImageUrlChanged(e) {
        setManualImageUrl(e.target.value)
        setPreviewImageButtonEnabled(!!e.target.value);
    }

    function handleLoadImageClick(e) {
        setEditedProduct({ ...editedProduct, mp_image_url: manualImageUrl });
        setPreviewImageButtonEnabled(false);
    }

    function handleDismissModalConfirmed() {
        setDismissModalIsOpen(false);
        setEditedProduct({});
        pendingActionOnDismiss();
    }

    function handlePaginationBarClick(value, force = false) {
        if (unsavedChanges()) {
            // Open modal if usedUser is usedUser has unsaved changes on a product
            setPendingActionOnDismiss(() => () => setCurrentPage(value));
            setDismissModalIsOpen(true)
        } else {
            setCurrentPage(value);
        }
    }

    function handleCreateClick(e, force = false) {
        if (unsavedChanges()) {
            // Open modal if usedUser is usedUser has unsaved changes on a product
            setPendingActionOnDismiss(() => () => setCreateModalIsOpen(true));
            setDismissModalIsOpen(true)
        } else {
            setCreateModalIsOpen(true);
        }
    }

    //// Helper functions
    function addNotification(notification) {
        setNotifications([...notifications, [(notifications.length > 0) ? notifications[notifications.length - 1][0] + 1 : 0, notification]]);
    }

    function deleteNotification(index) {
        setNotifications([...notifications.filter((_, i) => i !== index)])
    }

    function startEditingProduct(product) {
        setEditedIndex(products.indexOf(product));
        setEditedProduct({ ...product });
    }

    function selectCountry(countries) {
        return (
            <select id="mp_c_id_production" name="mp_c_id_production" onChange={handleInputChanged} value={editedProduct.mp_c_id_production}>
                <option value="null">Choose country...</option>
                <option disabled>──────────</option>
                {countries.map((country, idx) => {
                    return (<option key={idx} value={country.c_id}>{country.c_name}</option>)
                })}
            </select>
        )
    }

    function colorText(colorHex) {
        colorHex = colorHex.trim();
        if (colorHex != '') {
            return (colorHex != '' ? (`HEX: ${colorHex}, RGB: (${Object.values(hexToRgb(colorHex)).join(',')})`) : '');
        } else {
            return '';
        }
    }

    function onUploadComplete(url) {
        setEditedProduct({ ...editedProduct, mp_image_url: url });
        setManualImageUrl(url);
        setUploadProgress(-1);
    }

    //// Rendering functions
    function renderInputField(type, id, value) {
        let disabled, style;
        if (id == 'mp_color_code') {
            disabled = true
            style = { border: 'none' }
        } else {
            disabled = false
            style = {}
        }

        let required;
        if (['mp_price', 'mp_weight_kg', 'mp_name'].includes(id)) {
            required = true
        } else {
            required = false
        }

        let step = ""
        if (type.includes('number')) {
            step = type.slice(6);
            type = type.slice(0, 6);
            style = { textAlign: "right" }
        }

        return (
            <input
                type={type}
                step={step}
                id={id}
                name={id}
                value={value}
                onChange={handleInputChanged}
                data-tooltip-id={id}
                disabled={disabled}
                required={required}
                style={style}
            />
        );
    }

    return (
        <>
            <div id='portfolio-header' className='w-full pr-5 pl-5 pt-2'>
                {publicTestMode &&
                    <div className='flex flex-wrap justify-start pt-2 pb-2'>
                        <button type="button" onClick={() => { navigate(".") }}
                            className='button-test-mode text-wrap'>
                            Leave Public Test Mode
                        </button>
                    </div>
                }

                {/* <div className='hr' /> */}

                <div className='flex flex-wrap flex-col sm:flex-row sm:items-center items-start pb-2'>
                    <div className='flex-auto flex flex-row justify-start'>
                        <button onClick={handleCreateClick} disabled={maxProductsReached}
                            title={maxProductsReached ? `You reached the maximum number of products (limit: ${config.maxProductsPerUser}` : ''}
                            className='button-new-product flex justify-between items-center my-auto w-auto gap-2 text-nowrap'>
                            <span>+</span>
                            <span>New product</span>
                        </button>
                    </div>
                    <div className='flex-auto flex flex-row justify-center'>
                        <SearchBar onInputChange={(val) => setSearchString(val.trim())} />
                    </div>
                    <div className='flex-auto flex flex-row justify-end'>
                        <button onClick={() => handleDeleteAllClick()}
                            disabled={products.length == 0}
                            className='button-new-product flex items-center my-auto w-auto text-nowrap'>
                            <span>Delete all products</span>
                        </button>
                    </div>
                </div>
            </div>

            <PaginationBar
                currentPage={currentPage}
                nPages={nPages}
                isFiltered={isFiltered}
                index1={indexFirstProduct}
                index2={indexLastProduct}
                nProducts={filteredProducts.length}
                handleClick={handlePaginationBarClick} />

            {filteredProducts.length > 0 ?
                (
                    <div className="productlist">
                        {currentProducts.map((product) => (
                            (editedProduct.mp_id === product.mp_id) ? (
                                <div key={product.mp_id} className="productlist-item editing overflow-scroll w-full flex flex-col">
                                    <form onSubmit={handleSubmit}>
                                        <p className='product-details-row'>
                                            <strong>Product ID:</strong>&nbsp;{editedProduct.mp_id}
                                        </p>
                                        <div className='w-full flex flex-row flex-shrink gap-2 border-1 border-gray-600 p-2 rounded-sm mr-9'>
                                            <div className='product-details-row flex-grow flex flex-col'>
                                                <div className='flex flex-row items-center gap-2'>
                                                    <strong>Image</strong>
                                                    {uploadProgress >= 0 && uploadProgress < 1 &&
                                                        <ProgressBar value={uploadProgress} text="Uploading: " />
                                                    }
                                                </div>
                                                <Dropzone uploadImage={(x) => uploadImage(x, setUploadProgress, onUploadComplete)} showLargeIcon={false} />
                                                <span className='pb-1 text-center'>OR</span>
                                                <div className='flex flex-row'>
                                                    <input type="textarea" rows="2" id="mp_image_url" className='overflow-scroll h-40'
                                                        value={manualImageUrl} onChange={handleManualImageUrlChanged}
                                                        placeholder="Enter or paste URL here (http://...)" />
                                                    <button type="button" onClick={handleLoadImageClick} disabled={previewImageButtonEnabled ? false : true}
                                                        className={(!previewImageButtonEnabled ? 'button-disabled ' : '') + 'button-standard-inline pb-0.5'}>
                                                        Load
                                                    </button>
                                                </div>
                                            </div>
                                            <div className='flex-shrink'>
                                                <img src={editedProduct.mp_image_url} alt="Invalid image URL" className="product-image mt-1.5" />
                                            </div>
                                        </div>

                                        <p className='product-details-row'>
                                            <strong>Product Name:</strong>
                                            {renderInputField('text', 'mp_name', editedProduct.mp_name)}
                                        </p>

                                        <p className='product-details-row'>
                                            <strong>Production&nbsp;Country:</strong>
                                            {selectCountry(countries)}
                                        </p>

                                        <p className='product-details-row'>
                                            <strong>Color:</strong>
                                            <input type="color" className='my-auto w-10' value={editedProduct.mp_color} name='colorPicker' id="mp_color" onChange={handleInputChanged} />
                                            {renderInputField('text', 'mp_color_code', colorText(editedProduct.mp_color))}
                                        </p>

                                        <div className='product-details-row justify-between flex flex-row gap-5'>
                                            <div className='flex flex-row flex-grow w-40'>
                                                <div className='font-bold'>Weight:</div>
                                                {renderInputField('number0.1', 'mp_weight_kg', editedProduct.mp_weight_kg)}
                                                <div>{WEIGHT_UNIT}</div>
                                            </div>
                                            <div className='flex flex-row flex-grow w-40'>
                                                <div className='font-bold'>Price:</div>
                                                {renderInputField('number0.01', 'mp_price', editedProduct.mp_price)}
                                                <label>{editedProduct.mp_currency}</label>
                                            </div>
                                        </div>

                                        <div className='flex flex-row gap-1'>
                                            <button type='submit' className='button-standard'>Save</button>
                                            <button type='button' onClick={() => handleCancelClick()} className='button-standard-blue-grey'>Cancel</button>
                                        </div>

                                    </form>

                                </div>
                            ) : (
                                <div key={product.mp_id} className="productlist-item overflow-scroll h-auto flex flex-row flex-shrink">
                                    <div className='flex flex-col flex-grow'>
                                        <div align='left' className='float-left w-full'>
                                            <p><strong>Product ID:</strong> {product.mp_id}</p>
                                            <p><strong>Product Name:</strong> {product.mp_name}</p>
                                            <p><strong>Production&nbsp;Country:</strong> {product.c_name}</p>
                                            <p><strong>Color:</strong>
                                                <span className='color-show' style={{ display: 'inline-block', backgroundColor: product.mp_color }}></span>
                                                <span className='text-xs'>{colorText(product.mp_color)}</span>
                                            </p>
                                            <p><strong>Weight:</strong> {product.mp_weight_kg ? product.mp_weight_kg : '-'} {WEIGHT_UNIT}</p>
                                            <p><strong>Price:</strong> {product.mp_price ? product.mp_price : '-'} {product.mp_currency}</p>
                                        </div>
                                        <div className="flex flex-row gap-1">
                                            <button onClick={() => handleEditClick(product)} className='button-standard'>Edit</button>
                                            <button onClick={() => handleDeleteOneClick(product)} className='button-standard-blue-grey'>Delete</button>
                                        </div>
                                    </div>
                                    <div className='flex-shrink-0'>
                                        <img src={product.mp_image_url} alt={product.mp_name} className="product-image" />
                                    </div>
                                </div>
                            )
                        ))}
                    </div>
                ) : (
                    waitingForResponse ?
                        <div align="center">Loading...</div>
                        :
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

            <PaginationBar
                currentPage={currentPage}
                nPages={nPages}
                isFiltered={isFiltered}
                index1={indexFirstProduct}
                index2={indexLastProduct}
                nProducts={filteredProducts.length}
                handleClick={handlePaginationBarClick} />

            {/* Overlay components */}
            <Tooltip id={tooltipState[0]}
                content={tooltipState[1]}
                isOpen={tooltipIsOpen} />

            <ModalConfirmCancel isShown={deleteOneModalIsOpen} title='Confirm deletion' text={deleteModalText}
                onConfirm={() => { deleteProduct(); setDeleteOneModalIsOpen(false); }} onCancel={() => { setDeleteOneModalIsOpen(false) }} />

            <ModalConfirmCancel isShown={deleteAllModalIsOpen} title='Confirm deletion' text={deleteModalText}
                onConfirm={() => { deleteAllProducts(); setDeleteAllModalIsOpen(false); }} onCancel={() => { setDeleteAllModalIsOpen(false) }} />

            <ModalConfirmCancel isShown={dismissModalIsOpen} title='Dismiss unsaved changes' text={dismissModalText}
                onConfirm={() => { handleDismissModalConfirmed() }}
                onCancel={() => { setDismissModalIsOpen(false) }} />

            <ModalCreateProduct isShown={createModalIsOpen} countries={countries}
                onClose={() => setCreateModalIsOpen(false)} onCreate={createProduct} />

            <NotificationContainer
                notifications={notifications} deleteNotification={deleteNotification}
                className='fixed flex flex-col-reverse gap-1 bottom-5 left-5 z-20 w-full' />

        </>
    );
}

export default ProductPortfolioMerchant