import React, { Fragment, useState } from 'react';
import axios from 'axios';

const FileUpload = (props) => {
    const [uploadedFile, setUploadedFile] = useState({});
    const [fileUploadMessage, setFileUploadMessage] = useState("");
    const onChange = async (e) => {
        const formData = new FormData();
        formData.append('file', e.target.files[0]);
        formData.append('jsondataRequest', JSON.stringify({id:props.id,path:props.path}));

        try {
            const res = await axios.post('http://192.168.0.24:5400/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                onUploadProgress: (ProgressEvent) => {
                    setFileUploadMessage(`Uploading ${parseInt(Math.round((ProgressEvent.loaded * 100) / ProgressEvent.total))}%`);
                    if (ProgressEvent.total === ProgressEvent.loaded) {
                        setTimeout(() => setFileUploadMessage("File Uploaded."), 1000);
                    }
                }
            });

            const { fileName, filePath } = res.data;
            setUploadedFile({fileName, filePath});
        } catch(err) {
            if (err.response.status) {
                if (err.response.status === 500) {
                    setFileUploadMessage("There was a server error.");
                } else {
                    setFileUploadMessage(err.response.data.msg);
                }
            } else {
                console.log(err);
                setFileUploadMessage("Error.");
            }
        }
    }

    const begone = () => {
        document.getElementById('file-popup').style.display = "none";
    }

    return (
        <Fragment>
            <label htmlFor='theFile'>
                <img title="Upload a file or folder" className="file-upload-icon" src="./icons/upload.svg" style={{width: "100%"}} alt="Upload"/>
            </label>
            <input onChange={onChange} style={{display: "none" }} type="file" id="theFile"/>
            { fileUploadMessage ? <div id="file-popup" className='file-upload-popup'>
                <p>{fileUploadMessage}</p>
                <button onClick={begone}>&#10006;</button>
            </div>: null}
        </Fragment>
    );
}

export default FileUpload;