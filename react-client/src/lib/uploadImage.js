import axios from "axios";

export default function uploadImage(imageFile, setUploadProgress, onComplete) {
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
            const fractionCompleted = progressEvent.loaded / progressEvent.total;
            setUploadProgress(fractionCompleted);
        }
    };

    axios.post(api_url, formData, config)
        .then((response) => {
            // console.log("IMGBB API response");
            // console.log(response);
            onComplete(response.data.data.url);
        })
        .catch((err) => {
            console.log("IMGBB API error");
            console.log(err);
            if (err.response.data.error) {
                console.log(err.response.data.error);
            }
        });
}