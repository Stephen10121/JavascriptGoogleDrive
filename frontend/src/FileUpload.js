import React, { Fragment, useState } from 'react';
import axios from 'axios';

String.prototype.replaceAll = (search, replacement) => {
    var target = this;
    return target.split(search).join(replacement);
};

const FileUpload = (props) => {
    const [showUMessage, setShowUMessage] = useState(false);
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
                    setShowUMessage(true);
                    setFileUploadMessage(`Uploading ${parseInt(Math.round((ProgressEvent.loaded * 100) / ProgressEvent.total))}%`);
                    if (ProgressEvent.total === ProgressEvent.loaded) {
                        let files = props.usern.files;
                        const newFilePath = `${`${props.path}`.replaceAll('.','/')}/${e.target.files[0].name}`;
                        files.push(newFilePath);
                        let nuser = props.usern;
                        nuser[files] = files
                        props.changeFiles(nuser);
                        setTimeout(() => setFileUploadMessage("Click on folder to refresh."), 1000);
                    }
                }
            });
            console.log(res);
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
        setShowUMessage(false);
    }

    return (
        <Fragment>
            <label htmlFor='theFile'>
                <img title="Upload a file or folder" className="file-upload-icon" src="./icons/upload.svg" style={{width: "100%"}} alt="Upload"/>
            </label>
            <input onChange={onChange} style={{display: "none" }} type="file" id="theFile"/>
            { showUMessage ? <div id="file-popup" className='file-upload-popup'>
                <p>{fileUploadMessage}</p>
                <button onClick={begone}>&#10006;</button>
            </div>: null}
        </Fragment>
    );
}

export default FileUpload;