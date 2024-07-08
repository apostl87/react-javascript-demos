import React, {useState, useEffect} from "react";
import { Tooltip } from 'react-tooltip';
import { useAuth0 } from "@auth0/auth0-react";
import axios from 'axios';
import { ModalCreateProductTemplate } from '../Templates/Modal';
import Dropzone from '../Components/Dropzone';
import formatNumeric from '../lib/formatNumeric';
import uploadImage from "../lib/uploadImage";
import verifyUrlImage from '../lib/verifyUrlImage';

const ModalCreateProduct = ({ isShown, countries, onClose, onSubmit }) => {
    const { user } = useAuth0();

    // Tooltip hooks
    const [tooltipIsOpen, setTooltipIsOpen] = useState(null);
    const [tooltipState, setTooltipState] = useState(['', '']); // [name of input field, tooltip text]

    // Image hooks
    const [imageUrl, setImageUrl] = useState(''); // Actually used image url
    const [manualImageUrl, setManualImageUrl] = useState(''); // Manually input image url
    const [previewImageButtonEnabled, setPreviewImageButtonEnabled] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(-1);

    // Verify image url whenever imageUrl changes to value unequal to ''
    useEffect(() => {
        async function doAsync() {
            const isValid = await verifyUrlImage(imageUrl);
            if (!isValid) {
                setImageUrl('invalid');
                console.log('Invalid image url');
            }
        }
        if (imageUrl) doAsync();
    }, [imageUrl])

    function handleInputChanged(e) {
        let { id, value } = e.target;
        let formatInfo = null;
        let tooltipAnchorId = null;

        if (id == 'create-mp_weight_kg') {
            ({ value, formatInfo } = formatNumeric(value, 1));
            if (formatInfo !== '') tooltipAnchorId = id;
        } else if (id == 'create-mp_price') {
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

        document.getElementById(id).value = value;
        if (id.includes("color-picker")) {
            document.getElementById('create-mp_color').innerText = value;
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

    function uploadImae(imageFile, setUploadProgress) {
        // Constructing the axios request parameters
        let n_days = 30
        let expiration_time = n_days * 86400
        const api_url = `https://api.imgbb.com/1/upload?key=${process.env.REACT_APP_IMGBB_API_KEY}&expiration=${expiration_time}`;
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
                onUploadComplete(response.data.data.url);
            })
            .catch((err) => {
                console.log("IMGBB API error");
                console.log(err);
                if (err.response.data.error) {
                    console.log(err.response.data.error);
                }
            });
    }

    function onUploadComplete(url) {
        setImageUrl(url);
        setManualImageUrl(url);
        setUploadProgress(-1);
    }

    function handleClose(onClose) {
        onClose();
        setTooltipIsOpen(false);
        setImageUrl('');
    }

    function handleSubmit(e) {
        e.preventDefault();
        const mp_name = document.querySelector('#create-mp_name').value
        const mp_c_id_production = document.querySelector('#create-mp_c_id_production').value
        const mp_color = document.querySelector('#create-mp_color').innerText
        const mp_weight_kg = document.querySelector('#create-mp_weight_kg').value
        const mp_price = document.querySelector('#create-mp_price').value
        const requestBody = {
            mp_name: mp_name,
            mp_c_id_production: mp_c_id_production == -1 ? 'null' : mp_c_id_production,
            mp_color: mp_color,
            mp_weight_kg: mp_weight_kg,
            mp_price: mp_price,
            mp_currency: 'EUR',
            mp_image_url: imageUrl,
            mp_merchant_user_id: user.sub,
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

                            <label htmlFor="create-mp_name">
                                Product Name*
                            </label>
                            <input type="text" id="create-mp_name"
                                data-tooltip-id='create-mp_name' placeholder='Enter product name' required />

                            <label htmlFor="create-mp_c_id_production">
                                Production Country
                            </label>
                            <select id="create-mp_c_id_production" defaultValue="-1">
                                <option value="-1">Choose country...</option>
                                <option disabled>──────────</option>
                                {countries.map((country, idx) => {
                                    return (<option key={idx} value={country.c_id}>{country.c_name}</option>)
                                })}
                            </select>

                            <label htmlFor="create-mp_color">
                                Color
                            </label>
                            <div className='flex flex-row items-center'>
                                <input type="color" id='create-color-picker' defaultValue='#FFFFFF' onChange={handleInputChanged} />
                                <span id='create-mp_color' className='pl-1 mb-2'>#FFFFFF</span>
                            </div>

                            <label htmlFor="create-mp_weight_kg">
                                Weight in kg*
                            </label>
                            <input type="text" id="create-mp_weight_kg" placeholder='Enter weight'
                                data-tooltip-id="create-mp_weight_kg" onChange={handleInputChanged} required />

                            <label htmlFor="create-mp_price">
                                Price in EUR*
                            </label>
                            <input type="text" id="create-mp_price" placeholder='Enter price'
                                data-tooltip-id="create-mp_price" onChange={handleInputChanged} required />
                        </div>

                        <div className='flex-grow flex flex-col justify-start border-1 border-gray-400 rounded p-2 w-auto'>

                            <div className='flex flex-row justify-between'>
                                <label htmlFor="create-image">Image</label>
                                <button type="button" className='button-standard h-8' onClick={() => setImageUrl('')}>Reset image</button>
                            </div>


                            <div className='create-image-preview mx-auto mt-2'>
                                {imageUrl ?
                                    <img className='create-image-preview-img' src={imageUrl} alt="Invalid image URL" />
                                    :
                                    <p>(No image to preview)</p>}
                            </div>


                            {(uploadProgress >= 0 && uploadProgress < 1) ?
                                <span className='self-center pt-2'>Uploading image: {uploadProgress}%</span> : <></>}

                            <div className='create-image-upload-area pt-2 pb-2'>
                                <Dropzone uploadImage={(x) => uploadImage(x, setUploadProgress, onUploadComplete)} showLargeIcon={!imageUrl} />

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
                className='z-50'
                isOpen={tooltipIsOpen} />
        </div >
    )
}

export default ModalCreateProduct;