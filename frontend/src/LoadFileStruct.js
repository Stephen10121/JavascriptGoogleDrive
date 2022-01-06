import React, { useState } from "react";
import { convertToJson } from "./jsonIt";
import './styles/FileStruct.css';

const FileLoad = (props) => {
    const [files] = useState(JSON.parse(window.localStorage.getItem("user")).files);
    const [visible, changeVisible] = useState([]);

    const showFiles = (where) => {
        console.log(visible);
        console.log(where);
        let newFileLocation;
        if (where.includes('/')) {
            where = where.replace("/",".");
            newFileLocation = Object.keys(where.split('.').reduce((o,i)=> o[i], convertToJson(files)));
        }
        else {
            newFileLocation = Object.keys(convertToJson(files)[where]);
        }
        let newFolders = [];
        for (const checkFile of newFileLocation) {
            if (!checkFile.includes(".")) {
                newFolders.push(checkFile);
            }
        }
        const newStruct = newFolders.map((file, index) => <li><button key={index} onClick={() => showFiles(`${where}/${file}`)}>{file}</button><ul></ul></li>);
        document.getElementById(where).appendChild(<button>Cool</button>);
    }

    return (
    <div className="file-struct">
        <ul className="folder-ul">
            <li>
                <button onClick={() => showFiles("home")}>Root</button>
                <ul className="folder-ul" id="home">
                </ul>
            </li>
        </ul>
    </div>
    );
}

export default FileLoad;
