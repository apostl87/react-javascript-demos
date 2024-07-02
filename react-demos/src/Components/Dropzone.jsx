import React, { useCallback, useMemo } from 'react';
import { useDropzone } from 'react-dropzone';
import iconPhoto from '../media/icon-photo.svg'

export default function Dropzone(props) {
    // Custom onDrop hook for dropzone
    const onDropAccepted = useCallback(acceptedFiles => {
        props.uploadImage(acceptedFiles[0])
    }, [])

    const {
        acceptedFiles,
        fileRejections,
        getRootProps,
        getInputProps,
        isDragAccept,
        isDragReject
    } = useDropzone({
        maxFiles: 1,
        accept: {
            'image/jpg': [],
            'image/gif': [],
            'image/png': [],
        },
        maxSize: 3145728,
        onDropAccepted: onDropAccepted,
        onDropRejected: () => {},
    });

    const acceptedFileItems = acceptedFiles.map(file => (
        <li key={file.path}>
            {file.path} - {file.size} bytes
        </li>
    ));

    const fileRejectionItems = fileRejections.map(({ file, errors }) => {
        return (
            <li key={file.path}>
                {file.path} - {file.size} bytes
                <ul>
                    {errors.map(e => <li key={e.code}>{e.message}</li>)}
                </ul>

            </li>
        )
    });

    const acceptStyle = {
        borderColor: '#00e676',
        backgroundColor: '#d4ffd4',
    };

    const rejectStyle = {
        borderColor: '#ff1744',
        backgroundColor: '#ffd4d4',
    };

    const style = useMemo(() => ({
        ...(isDragAccept ? acceptStyle : {}),
        ...(isDragReject ? rejectStyle : {})
    }), [
        isDragAccept,
        isDragReject
    ]);

    return (
        <section className="dropzone-container">
            <div {...getRootProps({ className: 'dropzone', style })}>
                <input {...getInputProps()} />
                <img src={iconPhoto} className={props.boxIsLarge ? 'w-28' : 'hidden'} />
                <p className='pb-2'>Drag an image here or click to select</p>
                <em>Supported formats: JPEG, PNG, GIF</em>
                <em>Maximum size: 3 MB</em>
            </div>
            {fileRejections.length > 0 &&
                <aside>
                    {/* <h4>Accepted files</h4>
                    <ul>{acceptedFileItems}</ul> */}
                    <b>Rejected upload</b>
                    <ul>{fileRejectionItems}</ul>
                </aside>
            }
        </section>
    );
}

