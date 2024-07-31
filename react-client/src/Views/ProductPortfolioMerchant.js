import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth0 } from "@auth0/auth0-react";
import axios from 'axios';
import $ from 'jquery';
import { MoonLoader } from 'react-spinners';
import deepEqual from 'deep-equal';
import PaginationBar from '../Components/PaginationBar';
import SearchBar from '../Components/SearchBar';
import { ModalConfirmCancel } from '../Components/ModalConfirmCancel';
import { NotLoggedIn, NoDatabaseConnection } from '../Components/Misc';
import NotificationContainer from '../Components/NotificationContainer';
import ModalCreateProduct from '../Components/ModalCreateProduct';
import { AdminProductCardEdit, AdminProductCard} from '../Components/AdminProductCard';
import request from '../Services/request-service';
import formatNumeric from '../Utils/formatNumeric';
import verifyUrlImage from '../Utils/verifyUrlImage';
import { colorText } from '../Utils/generic';
import config from '../config';

const api_url = process.env.REACT_APP_BACKEND_API_URL;
const PUBLIC_TEST_USER = process.env.REACT_APP_PUBLIC_TEST_USER;

// Code needs a major overhaul
// - Refactoring of Components
// - Refactoring of certain functions

const ProductPortfolioMerchant = (props) => {
    // Auth0 hook
    const { user, isLoading } = useAuth0();

    // API connection and response
    const [databaseConnectionFailed, setDatabaseConnectionFailed] = useState(false);
    const [waitingForResponse, setWaitingForReponse] = useState(false);

    // Navigation
    const navigate = useNavigate();
    const location = useLocation();

    //// Variables, hooks, and basic functionality
    // Data from API calls
    const [products, setProducts] = useState([]);
    const [countries, setCountries] = useState([]);

    // Editing
    const [editedProduct, setEditedProduct] = useState({});
    const [editedIndex, setEditedIndex] = useState(-1);

    // Search filter
    const [searchString, setSearchString] = useState('')
    const isFiltered = !!searchString.trim()
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

    // Public test mode (Props does not work for this component for an unknown reason)
    const publicTestMode = location.pathname.split('/').slice(-1)[0] === 'public-test-mode';

    // Use actually logged in user, or public test mode user, or use falsy user
    // Memo for switching between public test mode user and actually logged in user
    const usedUser = useMemo(() => {
        if (user || !publicTestMode) {
            return user // Here, usedUser is the logged in used or falsy
        } else if (publicTestMode) {
            return { 'sub': PUBLIC_TEST_USER } // pseudo user
        }
    }, [user, publicTestMode])

    // Loading data
    useEffect(() => {
        let controller1, controller2
        if (usedUser) {
            controller1 = getMerchantProducts();
            controller2 = getCountries();
        }
        return () => {
            if (controller1) controller1.abort();
            if (controller2) controller2.abort();
        }
    }, [usedUser])

    // Pagination: Go back one page if current page is greater than number of pages (suboptimal effect)
    useEffect(() => {
        if (currentPage > nPages) {
            setCurrentPage(Math.max(currentPage - 1, 1))
        }
    }, [filteredProducts]);

    // Pagination: Go back to first page when search string changes (suboptimal effect)
    useEffect(() => {
        if (currentPage != 1) {
            setCurrentPage(1)
        }
    }, [searchString])

    // Disabling public test mode if user is logged in
    useEffect(() => {
        if (user && publicTestMode) {
            addNotification('Automatically left public test mode (You are logged in).')
            navigate(".");
            return;
        }
    }, [user, publicTestMode]);

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
            <NoDatabaseConnection />
        )
    }
    if ((!isLoading && !usedUser)) {
        return (
            <div className='flex flex-col items-center gap-3 px-5'>
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

    function getMerchantProducts() {
        const url = `${api_url}/merchant-products/${usedUser.sub}`
        const controller = new AbortController();
        const { signal } = controller;

        setWaitingForReponse(true);

        setTimeout(() => {
            controller.abort("Timeout")
        }, 10000)

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
        
        return controller;
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
        const controller = new AbortController();
        const {signal} = controller;

        request.get(url, { signal })
            .then(response => {
                setCountries(response.data);
            })
            .catch(error => {
                console.error(error);
                setDatabaseConnectionFailed(true);
            });

        return controller
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
            setEditedProduct({});
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
            setEditedProduct({});
            setCurrentPage(value);
        }
    }

    function handleCreateClick(e, force = false) {
        if (unsavedChanges()) {
            // Open modal if usedUser is usedUser has unsaved changes on a product
            setPendingActionOnDismiss(() => () => setCreateModalIsOpen(true));
            setDismissModalIsOpen(true)
        } else {
            setEditedProduct({});
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


    return (
        <>
            <div id='portfolio-header' className='w-full pr-5 pl-5 pt-2'>
                {publicTestMode &&
                    <div className='flex flex-wrap justify-start pt-2 pb-2'>
                        <button type="button" onClick={() => { navigate(".") }}
                            className='button-test-mode'>
                            Leave Public Test Mode
                        </button>
                    </div>
                }

                {/* <div className='hr' /> */}

                <div className='flex flex-wrap flex-col justify-between sm:flex-row pb-2'>
                    <SearchBar onInputChange={(val) => setSearchString(val.trim())} />
                    <div className='flex flex-row flex-wrap justify-center gap-2'>
                        <button onClick={handleCreateClick} disabled={maxProductsReached}
                            title={maxProductsReached ? `You reached the maximum number of products (limit: ${config.maxProductsPerUser}` : ''}
                            className='button-new-product flex justify-between items-center my-auto w-auto gap-2 text-nowrap'>
                            <span>Add new product</span>
                        </button>
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
                                <AdminProductCardEdit
                                    key={product.mp_id}
                                    product={editedProduct}
                                    handleSubmit={handleSubmit}
                                    handleCancelClick={handleCancelClick}
                                    setEditedProduct={setEditedProduct}
                                    countries={countries} />
                            ) : (
                                <AdminProductCard
                                    key={product.mp_id}
                                    product={product}
                                    handleEditClick={handleEditClick}
                                    handleDeleteClick={handleDeleteOneClick} />
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

            <ModalConfirmCancel isShown={deleteOneModalIsOpen} title='Confirm deletion' text={deleteModalText}
                onConfirm={() => { deleteProduct(); setDeleteOneModalIsOpen(false); }} onCancel={() => { setDeleteOneModalIsOpen(false) }} />

            <ModalConfirmCancel isShown={deleteAllModalIsOpen} title='Confirm deletion' text={deleteModalText}
                onConfirm={() => { deleteAllProducts(); setDeleteAllModalIsOpen(false); }} onCancel={() => { setDeleteAllModalIsOpen(false) }} />

            <ModalConfirmCancel isShown={dismissModalIsOpen} title='Dismiss unsaved changes' text={dismissModalText}
                onConfirm={() => { handleDismissModalConfirmed() }}
                onCancel={() => { setDismissModalIsOpen(false) }} />

            <ModalCreateProduct isShown={createModalIsOpen} countries={countries}
                onClose={() => setCreateModalIsOpen(false)} onCreate={createProduct}
                user={usedUser} />

            <NotificationContainer
                notifications={notifications} deleteNotification={deleteNotification}
                className='fixed flex flex-col-reverse gap-1 bottom-5 left-5 z-20 w-full' />

        </>
    );
}

export default ProductPortfolioMerchant