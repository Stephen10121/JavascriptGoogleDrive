//import React, { useEffect, useRef } from "react";
import './styles/FileStruct.css';

const FileLoad = (props) => {
    const checkEmpty = (file) => {
        if (file.length === 0) {
            return(<p>Empty Folder</p>);
        }
    }

    return (
    <div className="file-ind-struct">
        {checkEmpty(props.files)}
        {props.files.map((file, index) => <button key={index}>{file}</button>)}
    </div>
    );
}

export default FileLoad;