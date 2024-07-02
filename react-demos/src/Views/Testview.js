import React from 'react'
import MyDropzone from '../Components/MyDropzone'

const Testview = () => {

    function doupload() {
        let data = document.getElementById("file").files[0];
        let entry = document.getElementById("file").files[0];
        console.log('doupload', entry, data)
        // fetch('uploads/' + encodeURIComponent(entry.name), { method: 'PUT', body: data });
        // alert('your file has been uploaded');
    };

    return (
        <div>
            {/* <MyDropzone /> */}

            <input type="file" name="file" id="file" />
            <button onClick={doupload} name="submit">Upload File</button>
        </div>
    )
}

export default Testview