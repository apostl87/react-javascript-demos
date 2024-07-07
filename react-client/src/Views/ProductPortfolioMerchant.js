import React, { useState, useEffect, useRef } from 'react';
import { Tooltip } from 'react-tooltip';
import { useAuth0 } from "@auth0/auth0-react";
import axios from 'axios';
import $, { parseHTML, valHooks } from 'jquery';
import PaginationBar from '../Components/PaginationBar';
import SearchBar from '../Components/SearchBar';
import { ModalCreateProductTemplate } from '../Templates/Modal';
import { ModalConfirmCancel } from '../Components/ModalConfirmCancel';
import Dropzone from '../Components/Dropzone';
import {NotLoggedIn} from '../Components/Misc';
import request from '../services/request-service';

const api_url = process.env.REACT_APP_BACKEND_API_URL;

// Code needs a major overhaul
// - Refactoring of Components
// - Refactoring of certain functions

function ProductPortfolioMerchant() {
    // Auth0 hook
    const { user,
        isLoading,
        loginWithRedirect,
    } = useAuth0();

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

    // Create hooks
    const [createModalIsOpen, setCreateModalIsOpen] = useState(false);

    // Notification hook
    const [notification, setNotification] = useState('')

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

    function updateProduct(product_id) {
        const url = `${api_url}/merchant-products/${user.sub}/${product_id}`;
        request.patch(url, editedProduct)
            .then(response => {
                setEditedProduct({});
                getProducts(); // #TODO: avoid this extra api call by updating the product in the frontend
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
                    setNotification('Product created successfully!');
                } catch {
                    setNotification('Failed to create product. Please try again.');
                }
            })
            .catch(error => {
                console.error(error);
            });
    }

    function deleteProduct() {
        const url = `${api_url}/merchant-products/${user.sub}/${productToDelete.id}`
        request.delete(url)
            .then(response => {
                getProducts(); // #TODO: avoid this extra api call by updating the product in the frontend
                // TODO: notification
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
                // TODO: notification
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
                // TODO: notification
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
        const products = mapProductData(data)
        setProducts(products);
    }

    function mapProductData(data) {
        const products = data.map(data => {
            return {
                id: data.id,
                product_name: data.product_name,
                color: data.color,
                image_url: data.image_url,
                price_currency: data.price_currency,
                price: data.price,
                weight_kg: data.weight_kg,
                country_id_production: data.country_id_production,
                country_name: data.country_name,
            };
        });
        return (products);
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
        } else if (!editedProduct.weight_kg) {
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

    function handleDeleteAllClick() {
        setDeleteAllModalIsOpen(true);
        setDeleteModalText(`Are you sure you want to delete all products?`);
    }

    function handleInputChanged(e) {
        let { name, value } = e.target;
        if (name == 'weight_kg') {
            value = formatNumeric(name, value, 1, setTooltipIsOpen, setTooltipState);
        }
        if (name == 'price') {
            value = formatNumeric(name, value, 2, setTooltipIsOpen, setTooltipState);
        }
        setEditedProduct({ ...editedProduct, [name]: value });
    }

    // Helper functions
    function selectCountry(countries) {
        return (
            <select id="country_id_production" name="country_id_production" onChange={handleInputChanged} value={editedProduct.country_id_production}>
                {countries.map((country, idx) => {
                    return (<option key={idx} value={country.country_id}>{country.country_name}</option>)
                })}
            </select>
        )
    }

    function inputField(type, name, value) {
        let disabled
        if (name == 'color') {
            disabled = true
        } else {
            disabled = false
        }
        return (
            <input
                type={type}
                name={name}
                value={value}
                onChange={handleInputChanged}
                data-tooltip-id={name}
                disabled={disabled}
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

            <div className='flex flex-row flex-wrap justify-center gap-4'>
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
                            <div key={product.id} className="product-item">
                                <div className='w-full flex flex-shrink'>
                                    {editedProduct.id === product.id ? (
                                        <div className='w-full flex flex-shrink gap-1'>
                                            <div className='flex-shrink'>
                                                <img src={product.image_url} alt={product.product_name} className="product-image" />
                                            </div>
                                            <div className='flex flex-col'>
                                                <form onSubmit={(e) => {
                                                    e.preventDefault();
                                                    handleSaveClick(product.id);
                                                }}>
                                                    <div align='left' className='w-full'>
                                                        <p className='product-details-row'>
                                                            <strong>Product ID:</strong> {editedProduct.id}
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
                                                            &nbsp;&nbsp;Pick
                                                            <input type="color" className='my-auto' value={editedProduct.color} name='color' id="colorPicker" onChange={handleInputChanged} />
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
                                                    </div>
                                                    <div className='flex flex-row-reverse gap-1'>
                                                        <button type='submit' onClick={() => handleSaveClick(editedProduct.id)} className='button-standard'>Save</button>
                                                        <button type='button' onClick={() => handleCancelClick()} className='button-standard-blue-grey'>Cancel</button>
                                                    </div>
                                                </form>
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
                                                    <p><strong>Weight:</strong> {product.weight_kg ? product.weight_kg : '-'} {WEIGHT_UNIT}</p>
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

            {filteredProducts.length > 0 &&
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

        </div >
    );
}

export default ProductPortfolioMerchant

function formatNumeric(id, value, precision, setTooltipIsOpen, setTooltipState) {
    let regex = /^([0-9]+)(\.)([0-9]*)$/;

    if (!regex.test(value)) {
        let ct = (value.match(/\./g) || []).length;
        if (value.match(/[^\d\.]/g) || ct > 1) {
            setTooltipState([id, "Format: " + String(Number(0).toFixed(precision))]);
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

const ModalCreateProduct = ({ isShown, countries, onClose, onSubmit }) => {
    const { user } = useAuth0();

    // Tooltip hooks
    const [tooltipIsOpen, setTooltipIsOpen] = useState(null);
    const [tooltipState, setTooltipState] = useState(['', '']); // [name of input field, tooltip text]

    // Image hooks
    const [imageUrl, setImageUrl] = useState(''); // Actually used image url
    const [manualImageUrl, setManualImageUrl] = useState(''); // Manually input image url
    // const [imageFile, setImageFile] = useState({});
    const [previewImageButtonEnabled, setPreviewImageButtonEnabled] = useState(false);
    // const [uploadImageButtonEnabled, setUploadImageButtonEnabled] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(-1);

    useEffect(() => {
        async function doAsync() {
            const isValid = await verifyUrlImage(imageUrl);
            if (!isValid) {
                setImageUrl('');
            }
        }
        doAsync();
    }, [imageUrl])

    // useEffect(() => {
    //     setUploadImageButtonEnabled(true)
    // }, [imageFile])

    function handleInputChanged(e) {
        let { id, value } = e.target;
        if (id == 'create-weight_kg') {
            value = formatNumeric(id, value, 1, setTooltipIsOpen, setTooltipState);
        }
        if (id == 'create-price') {
            value = formatNumeric(id, value, 2, setTooltipIsOpen, setTooltipState);
        }
        document.getElementById(id).value = value;
        if (id.includes("color-picker")) {
            document.getElementById('create-color').innerText = value;
        }
    }

    function handleManualImageUrlChanged(e) {
        setManualImageUrl(e.target.value)
        setPreviewImageButtonEnabled(!!e.target.value);
    }

    function handleLoadImageClicked(e) {
        setImageUrl(manualImageUrl);
        setPreviewImageButtonEnabled(false);
    }

    // function handleImageFileChanged(e) {
    //     setImageFile(e.target.files[0])
    //     if (e.target.files.size > 3145728) {
    //         document.getElementById('create-image-file-info').innerText = "Uploaded file must be smaller than 3 MB."
    //     } else {
    //         setUploadImageButtonEnabled(true);
    //     }
    // }

    // function uploadImageClicked(e) {
    //     e.preventDefault();
    //     uploadImage(imageFile);
    //     setUploadImageButtonEnabled(false);
    // }

    function uploadImage(imageFile) {
        // Constructing the axios request parameters
        const api_url = `https://api.imgbb.com/1/upload?key=${process.env.REACT_APP_IMGBB_API_KEY}&expiration=259200`;
        const formData = new FormData();
        formData.append('image', imageFile);
        const config = {
            headers: {
                'content-type': 'multipart/form-data',
            },
            onUploadProgress: (progressEvent) => {
                const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                setUploadProgress(percentCompleted);
            }
        };

        axios.post(api_url, formData, config)
            .then((response) => {
                console.log("IMGBB API response");
                console.log(response);
                handleUploadComplete(response.data.data.url);
            })
            .catch((err) => {
                console.log("IMGBB API error");
                console.log(err);
                if (err.response.data.error) {
                    console.log(err.response.data.error);
                }
            });
    }

    function handleUploadComplete(url) {
        setImageUrl(url);
        setUploadProgress(-1);
    }

    function handleClose(onClose) {
        onClose();
        setTooltipIsOpen(false);
        setImageUrl('');
    }

    function handleSubmit(e) {
        e.preventDefault();
        const product_name = document.querySelector('#create-product_name').value
        const country_id_production = document.querySelector('#create-country_id_production').value
        const color = document.querySelector('#create-color').innerText
        const weight_kg = document.querySelector('#create-weight_kg').value
        const price = document.querySelector('#create-price').value
        const requestBody = {
            product_name: product_name,
            country_id_production: country_id_production,
            color: color,
            weight_kg: weight_kg,
            price: price,
            price_currency: 'EUR',
            image_url: imageUrl,
            merchant_userid: user.sub,
        }
        onSubmit(requestBody);
        handleClose(onClose);
    }

    return (
        <div className='w-3/4'>
            <ModalCreateProductTemplate isShown={isShown}>
                <h4>Create product</h4>
                <hr />
                <form onSubmit={handleSubmit} id='createform'>
                    <div className='modal-create-product flex flex-row flex-wrap justify-between gap-4 items-start'>
                        <div className='grid grid-rows-1 w-auto flex-grow overflow-scroll'>

                            <label htmlFor="create-product_name">
                                Product Name*
                            </label>

                            <input type="text" id="create-product_name"
                                data-tooltip-id='create-product-name' placeholder='Enter product name' required />

                            <label htmlFor="create-country_id_production">
                                Production Country
                            </label>
                            <select id="create-country_id_production" defaultValue="0">
                                <option value="-1">Choose country...</option>
                                <option disabled>──────────</option>
                                {countries.map((country, idx) => {
                                    return (<option key={idx} value={country.country_id}>{country.country_name}</option>)
                                })}
                            </select>

                            <label htmlFor="create-weight_kg">
                                Color
                            </label>
                            <div className='flex flex-row items-center'>
                                <input type="color" id='create-color-picker' defaultValue='#FFFFFF' onChange={handleInputChanged} />
                                <span id='create-color' className='pl-1 mb-2'>#FFFFFF</span>
                            </div>

                            <label htmlFor="create-weight_kg">
                                Weight in kg*
                            </label>
                            <input type="text" id="create-weight_kg" placeholder='Enter weight'
                                data-tooltip-id="create-weight_kg" onChange={handleInputChanged} required />

                            <label htmlFor="create-price">
                                Price in EUR*
                            </label>
                            <input type="text" id="create-price" placeholder='Enter price'
                                data-tooltip-id="create-price" onChange={handleInputChanged} required />
                        </div>

                        <div className='flex-grow flex flex-col justify-start border-1 border-gray-400 rounded p-2 w-auto'>

                            <div className='flex flex-row justify-between'>
                                <label htmlFor="create-image">Image</label>
                                <button type="button" className='button-standard h-8' onClick={() => setImageUrl('')}>Reset image</button>
                            </div>


                            <div className='create-image-preview mx-auto mt-2'>
                                {imageUrl ?
                                    <img className='create-image-preview-img' src={imageUrl} alt="No product image linked." />
                                    :
                                    <p>(No image preview)</p>}
                            </div>


                            {(uploadProgress >= 0 && uploadProgress < 100) ?
                                <span className='self-center'>Uploading image: {uploadProgress}%</span> : <></>}

                            <div className='create-image-upload-area pt-2 pb-2'>
                                <Dropzone uploadImage={uploadImage} boxIsLarge={!imageUrl} />

                                {/* Alternative solution without Dropzone */}
                                {/* <input type="file" id="create-image-file" onChange={handleImageFileChanged}
                                    accept="image/*" className='h-3 w-full' />
                                <button type="button" onClick={uploadImageClicked}
                                    className={(!uploadImageButtonEnabled ? 'button-disabled ' : '') + 'button-standard w-full'} disabled={!uploadImageButtonEnabled}>
                                    Upload image
                                </button> */}
                            </div>

                            <span className='pb-1 self-center'>OR</span>

                            <input type="text" id="create-image-url-manual" value={manualImageUrl}
                                placeholder='Enter or paste URL here (http://...)' onChange={handleManualImageUrlChanged} />
                            <button type="button" onClick={handleLoadImageClicked}
                                className={(!previewImageButtonEnabled ? 'button-disabled ' : '') + "button-standard"} disabled={!previewImageButtonEnabled}>
                                Load image from URL
                            </button>

                        </div>

                    </div>

                    <div className="flex flex-row justify-between gap-2 mt-3 overflow-scroll">
                        <span>
                            * ... required
                        </span>
                        <div className='flex gap-2'>
                            <button type='button' className="button-standard-blue-grey" onClick={() => handleClose(onClose)}>Cancel</button>
                            <button type='submit' className="button-standard">Create product</button>
                        </div>
                    </div>
                </form>
            </ModalCreateProductTemplate >
            <Tooltip id={tooltipState[0]}
                content={tooltipState[1]}
                isOpen={tooltipIsOpen} />
        </div >
    )
}

async function verifyUrlImage(url) {
    try {
        let resp = $.ajax(url);
        await resp;
        let headers = resp.getAllResponseHeaders().split(/\n/g);
        for (let i = 0; i <= headers.length; i++) {
            let hd = headers[i].split(': ')
            if (hd[0] == 'content-type' && hd[1].indexOf('image') == 0)
                return true;
        }
    }
    catch { }
    return false;
}
