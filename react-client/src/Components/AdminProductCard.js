import React, { useState, useRef } from 'react'
import { Tooltip } from 'react-tooltip';
import Dropzone from './Dropzone';
import ProgressBar from './ProgressBar';
import uploadImage from '../Utils/uploadImage';
import verifyUrlImage from '../Utils/verifyUrlImage';
import { colorText } from '../Utils/generic';

export const AdminProductCardEdit = (props) => {
    const product = props.product
    const countries = props.countries
    const handleSubmit = props.handleSubmit
    const handleCancelClick = props.handleCancelClick
    const setEditedProduct = props.setEditedProduct

    // Image
    const [manualImageUrl, setManualImageUrl] = useState(''); // Manually input image url
    const [uploadProgress, setUploadProgress] = useState(-1);
    const [previewImageButtonEnabled, setPreviewImageButtonEnabled] = useState(false);

    // Tooltip
    const [tooltipIsOpen, setTooltipIsOpen] = useState(false);
    const [tooltipState, setTooltipState] = useState(['', '']); // [data-tooltip-id, tooltip text]
    const tooltipTimeoutRef = useRef(null)

    function handleInputChanged(e) {
        let { id, value } = e.target;
        let tooltipAnchorId = null;

        // Sanitization is done by the backend
        // Validation should go here
        // ...

        if (tooltipAnchorId) {
            setTooltipState([tooltipAnchorId, 'tooltip text here']);
            openTooltip();
        }

        setEditedProduct({ ...product, [id]: value });
    }

    function handleManualImageUrlChanged(e) {
        setManualImageUrl(e.target.value)
        setPreviewImageButtonEnabled(!!e.target.value);
    }

    function handleLoadImageClick(e) {
        // Verify image url whenever imageUrl changes to value unequal to ''
        async function doVerify() {
            const isValid = await verifyUrlImage(manualImageUrl);
            if (!isValid) {
                setEditedProduct({ ...product, mp_image_url: 'invalid' });
                console.log('Invalid image url');
            } else {
                setEditedProduct({ ...product, mp_image_url: manualImageUrl });
            }
        }
        if (manualImageUrl) doVerify();
        setPreviewImageButtonEnabled(false);
    }

    function onUploadComplete(url) {
        setEditedProduct({ ...product, mp_image_url: url });
        setManualImageUrl(url);
        setUploadProgress(-1);
        setPreviewImageButtonEnabled(false);
    }

    const openTooltip = () => {
        setTooltipIsOpen(true);
        // Hide tooltip after a delay
        clearTimeout(tooltipTimeoutRef.current)
        tooltipTimeoutRef.current = setTimeout(() => setTooltipIsOpen(false), 3500)
    }

    return (
        <div key={product.mp_id} className="productcard-edit">
            <form onSubmit={handleSubmit}>
                <p className='productcard-edit-field'>
                    <span>
                        <strong>Product ID:</strong>&nbsp;{product.mp_id}
                    </span>
                </p>

                <div className='productcard-edit-image-section'>
                    <div className='flex-grow flex flex-col'>
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
                                className={(!previewImageButtonEnabled ? 'disabled ' : '') + 'button-standard-inline pb-0.5'}>
                                Load
                            </button>
                        </div>
                    </div>
                    <div className='flex-shrink'>
                        <img src={product.mp_image_url} alt="Invalid image URL" className="productcard-image mt-1.5" />
                    </div>
                </div>

                <p className='productcard-edit-field'>
                    <strong>Product Name:</strong>
                    <input type='text' id='mp_name' name='mp_name'
                        value={product.mp_name} onChange={handleInputChanged}
                        data-tooltip-id='mp_name'
                        required
                    />
                </p>

                <p className='productcard-edit-field'>
                    <strong>Production&nbsp;Country:</strong>
                    <select id="mp_c_id_production" name="mp_c_id_production" onChange={handleInputChanged} value={product.mp_c_id_production}>
                        <option value="null">Choose country...</option>
                        <option disabled>──────────</option>
                        {countries.map((country, idx) => {
                            return (<option key={idx} value={country.c_id}>{country.c_name}</option>)
                        })}
                    </select>
                </p>

                <p className='productcard-edit-field'>
                    <strong>Color:</strong>
                    <input type="color" className='my-auto w-10' value={product.mp_color} name='colorPicker' id="mp_color" onChange={handleInputChanged} />
                    <input type='text' id='mp_color_code' name='mp_color_code' data-tooltip-id='mp_color_code'
                        value={colorText(product.mp_color)} style={{ border: 'none' }}
                        disabled
                    />
                </p>

                <div className='productcard-edit-field gap-5'>
                    <div className='flex flex-row flex-grow w-40'>
                        <div className='font-bold'>Weight:</div>
                        <input type='number' step='0.1'
                            id='mp_weight_kg' name='mp_weight_kg' data-tooltip-id='mp_weight_kg'
                            value={product.mp_weight_kg} onChange={handleInputChanged}
                            style={{ textAlign: "right" }} required
                        />
                        <label>kg</label>
                    </div>
                    <div className='flex flex-row flex-grow w-40'>
                        <div className='font-bold'>Price:</div>
                        <input type='number' step='0.01'
                            id='mp_price' name='mp_price' data-tooltip-id='mp_price'
                            value={product.mp_price} onChange={handleInputChanged}
                            style={{ textAlign: "right" }} required
                        />
                        <label>{product.mp_currency}</label>
                    </div>
                </div>

                <div className='flex flex-row gap-1'>
                    <button type='submit' className='button-standard'>Save</button>
                    <button type='button' onClick={() => handleCancelClick()} className='button-standard-blue-grey'>Cancel</button>
                </div>
            </form>

            {/* Overlay components */}

            <Tooltip id={tooltipState[0]}
                content={tooltipState[1]}
                isOpen={tooltipIsOpen} />
        </div>
    )
}

export const AdminProductCard= (props) => {
    let product = props.product
    let handleEditClick = props.handleEditClick
    let handleDeleteClick = props.handleDeleteClick

    return (
        <div key={product.mp_id} className="productcard">
            <div className='flex flex-col flex-grow'>
                <div align='left' className='float-left w-full'>
                    <p><strong>Product ID:</strong> {product.mp_id}</p>
                    <p><strong>Product Name:</strong> {product.mp_name}</p>
                    <p><strong>Production&nbsp;Country:</strong> {product.c_name}</p>
                    <p><strong>Color:</strong>
                        <span className='color-show' style={{ display: 'inline-block', backgroundColor: product.mp_color }}></span>
                        <span className='text-xs'>{colorText(product.mp_color)}</span>
                    </p>
                    <p><strong>Weight:</strong> {product.mp_weight_kg ? product.mp_weight_kg : '-'} kg</p>
                    <p><strong>Price:</strong> {product.mp_price ? product.mp_price : '-'} {product.mp_currency}</p>
                </div>
                <div className="flex flex-row gap-1">
                    <button onClick={() => handleEditClick(product)} className='button-standard'>Edit</button>
                    <button onClick={() => handleDeleteClick(product)} className='button-standard-blue-grey'>Delete</button>
                </div>
            </div>
            <div className='flex-shrink-0'>
                <img src={product.mp_image_url} alt={product.mp_name} className="productcard-image" />
            </div>
        </div>
    )
}