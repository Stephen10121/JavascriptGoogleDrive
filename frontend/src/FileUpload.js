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
        if (!e.target.files) {
            return;
        }
        const formData = new FormData();
        if (e.target.files.length === 0) {
            return;
        }
        if(!e.target.files[0].name.includes(".")) {
            setFileUploadMessage("Select a valid file.");
            setShowUMessage(true);
            return;
        }
        formData.append('file', e.target.files[0]);
        formData.append('jsondataRequest', JSON.stringify({id:props.id,path:props.path}));
        try {
            const res = await axios.post('/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                onUploadProgress: (ProgressEvent) => {
                    setShowUMessage(true);
                    setFileUploadMessage(`Uploading ${parseInt(Math.round((ProgressEvent.loaded * 100) / ProgressEvent.total))}%`);
                    if (ProgressEvent.total === ProgressEvent.loaded) {
                        setFileUploadMessage(`Uploading 100%`);
                        let files = props.files;
                        console.log(`${props.path}`.replaceAll('.','/'));
                        const newFilePath = `${`${props.path}`.replaceAll('.','/')}/${e.target.files[0].name}`;
                        console.log(newFilePath);
                        files.push(newFilePath);
                        props.changefiles(files);
                        props.updater(props.path);
                        setTimeout(() => setFileUploadMessage("Upload Finished!"), 600);
                    }
                }
            });
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
                <img title="Upload a file or folder" className="file-upload-icon image-icon" src="./icons/upload.svg" alt="Upload"/>
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