//import React, { useEffect, useRef } from "react";
import File from "./File";
import './styles/FileStruct.css';

const FileLoad = (props) => {
    const checkEmpty = (file) => {
        if (file.length === 0) {
            return(<p>Empty Folder</p>);
        }
    }

    return (
    <div className="file-ind-struct">
        <p id="file-empty-p">{checkEmpty(props.files)}</p>
        {props.files.map((file, index) => <File key={index} path={props.path} file={file}/>)}
    </div>
    );
}

export default FileLoad;