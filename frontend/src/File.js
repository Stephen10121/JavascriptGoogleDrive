import React, { useState } from 'react';
import { getType } from "./fileType";
import './styles/File.css';
const axios = require("axios");

const File = (props) => {
    const [fileUploadMessage, setFileUploadMessage] = useState("");
    const [showingNotification, setShowingNotification] = useState(false);

    const downloadFile = async (id2, which, file) => {
        console.log(which, id2);
        const data = await axios.get(
            '/download',
            { params: {
                id: id2,
                location: which
            },
            onDownloadProgress: progressEvent => {
                setShowingNotification(true);
                const total = parseFloat(progressEvent.total)
                const current = progressEvent.currentTarget.response.length;
                let percentCompleted = Math.floor(current / total * 100);
                if (percentCompleted === 100) {
                    setFileUploadMessage("File Downloaded.");
                } else {
                    setFileUploadMessage(`Downloading ${percentCompleted}%`);
                }
            }
        });
        if (data.status === 200) {
            const url = window.URL.createObjectURL(new Blob([data.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', file); //or any other extension
            document.body.appendChild(link);
            link.click();
            return 200;
        } else {
            return "error";
        }
    }
    const toggle = (e) => {
        let box = document.getElementById(`${props.file}1`);
        let rect = box.getBoundingClientRect();
        let width = box.offsetWidth;
        let height = box.offsetHeight;
        if (rect.top < e.clientY && e.clientY < rect.top+height && rect.left < e.clientX && e.clientX < rect.left+width) {
            console.log();
        } else {
            document.getElementById(props.file).style.display = 'none';
        }
    }

    const showInfo = (where) => {
        document.getElementById(where).style.display = "flex";
    }

    const begone = (e) => {
        setShowingNotification(false);
    }

    return (
        <div className='file-container'>
            <button className="file" onClick={() => {showInfo(props.file)}}>
                {props.file}
            </button>
            <div className='file-popup' id={props.file} onClick={(e) => toggle(e)}>
                <div id={`${props.file}1`}>
                    <p>Owner: {props.owner}</p>
                    <p>Path: {`${props.path.replaceAll(".",'/')}/${props.file}`}</p>
                    <p>Content-type: {getType(props.file.split(".").reverse()[0])}</p>
                    <button onClick={() => {downloadFile(props.id, `${props.path.replaceAll(".",'/')}/${props.file}`, props.file)}}>Download</button>
                </div>
            </div>
            { showingNotification ? <div id="file-popup" className='file-upload-popup'>
                <p>{fileUploadMessage}</p>
                <button onClick={begone}>&#10006;</button>
            </div>: null}
        </div>
    );
}

export default File;