import React, { useState } from "react";
import { convertToJson } from "./jsonIt";
import './styles/FileStruct.css';

const FileLoad = (props) => {
    const [files] = useState(JSON.parse(window.localStorage.getItem("user")).files);
    const [visible, changeVisible] = useState([]);

    const showFiles = (where) => {
        console.log("show files");
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
        return(newFolders.map((file, index) => 
            <li key={Math.floor(Math.random()*1000)}>
                <button key={Math.floor(Math.random()*1000)}>{file}</button>
                <ul key={Math.floor(Math.random()*1000)} className="folder-ul">
                    {showFiles(`${where}/${file}`)}
                </ul>
            </li>
        ));
    }

    const renderFolders = (where) => {
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
        //const newStruct = newFolders.map((file, index) => <li><button key={index} onClick={() => showFiles(`${where}/${file}`)}>{file}</button><ul></ul></li>);
        //<button key={index} onClick={() => showFiles(`${where}/${file}`)}>{file}</button>
        changeVisible(newFolders.map((file, index) => 
            <li key={Math.floor(Math.random()*1000)}>
                <button key={Math.floor(Math.random()*1000)}>{file}</button>
                <ul key={Math.floor(Math.random()*1000)} className="folder-ul">
                    {showFiles(`${where}/${file}`)}
                </ul>
            </li>
        ));
    }

    return (
    <div className="file-struct">
        <ul className="folder-ul">
            <li>
                <button onClick={() => renderFolders("home")}>Root</button>
                <ul className="folder-ul" id="home">
                    {visible}
                </ul>
            </li>
        </ul>
    </div>
    );
}

export default FileLoad;
