import React, { useState } from 'react';
import { getType } from "./fileType";
import shareFilePost from "./shareFilePost";
import deleteFilePost from "./deleteFilePost";
import './styles/File.css';

const File = (props) => {
    const [fileUploadMessage, setFileUploadMessage] = useState("");
    const [showingNotification, setShowingNotification] = useState(false);

    const downloadFile = async (id2, which, file) => {
        console.log(which, id2, window.location.href);
        window.location.href = `https://drive.gruzservices.com/download?id=${id2}&location=${which}`;
        setShowingNotification(true);
        setFileUploadMessage("File Downloading.");
        return;
    }

    const shareFile = async (id2, which, file) => {
        document.getElementById(props.file).style.display = 'none';
        props.textPopup("Share with", shareTo, {id2, which, file});
    }

    const deleteFile = async (id2, which, file) => {
        document.getElementById(props.file).style.display = 'none';
        props.yesNoPopup("Delete File?", deleteFileRes, {id2, which, file});
    }

    const deleteFileRes = async (info, {id2, which, file}) => {
        if (!info) {
            return;
        }
        const res = await deleteFilePost(id2, which, file);
        if (res.data.msg) {
            setShowingNotification(true);
            setFileUploadMessage(res.data.msg);
            if (res.data.msg === "Success") {
                props.updater(which, {rm: file});
            }
        } else {
            setShowingNotification(true);
            setFileUploadMessage("An error occured.");
        }
    }

    const shareTo = async (info, {id2, which, file}) => {
        const res = await shareFilePost(id2, info, which, file);
        if (res.data.msg) {
            setShowingNotification(true);
            setFileUploadMessage(res.data.msg);
        } else {
            setShowingNotification(true);
            setFileUploadMessage("An error occured.");
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
                <div id={`${props.file}1`} className="file-popup-box">
                    <p>Owner: {props.owner}</p>
                    <p>Path: {`${props.path.replaceAll(".",'/')}/${props.file}`}</p>
                    <p>Content-type: {getType(props.file.split(".").reverse()[0])}</p>
                    <div className='file-button-group'>
                        <button className='download-button' onClick={() => {downloadFile(props.id, `${props.path.replaceAll(".",'/')}/${props.file}`, props.file)}}>Download</button>
                        <button className='share-button' onClick={() => {shareFile(props.id, `${props.path.replaceAll(".",'/')}/${props.file}`, props.file)}}>Share</button>
                        <button className='delete-button' onClick={() => {deleteFile(props.id, props.path.replaceAll(".",'/'), props.file)}}>Delete</button>
                    </div>
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