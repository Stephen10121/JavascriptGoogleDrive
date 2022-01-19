import React, { useState } from "react";
import convertToJson from "./jsonIt";
import './styles/FileStruct.css';

const FolderLoad = (props) => {
    const [files] = useState(JSON.parse(window.localStorage.getItem("user")).files);
    const [visible, changeVisible] = useState([]);

    const showFiles = (where) => {
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
            <li key={Math.floor(Math.random()*index*1000)+5}>
                <button id={`${where}/${file}1`} key={Math.floor(Math.random()*index*1000)+6} onClick={(e) => {toggleFolder(e,`${where}/${file}`);props.changeDir(`${where}/${file}`)}}>{file}</button>
                <ul key={Math.floor(Math.random()*index*1000)+7} className="folder-ul hidden" id={`${where}/${file}`}>
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
        
        changeVisible(newFolders.map((file, index) => 
            <li key={Math.floor(Math.random()*index*1000)+1}>
                <button id={`${where}/${file}1`} key={Math.floor(Math.random()*index*1000)+2} onClick={(e) => {toggleFolder(e,`${where}/${file}`);props.changeDir(`${where}/${file}`)}}>{file}</button>
                <ul key={Math.floor(Math.random()*index*1000)+3} className="folder-ul hidden" id={`${where}/${file}`}>
                    {showFiles(`${where}/${file}`)}
                </ul>
            </li>
        ));
    }

    const toggleFolder = (event, which) => {
        document.getElementById(which).classList.toggle('hidden');
        document.getElementById(event.target.id).classList.toggle('open');
    }

    return (
    <div className="file-struct">
        <ul>
            <li>
                <button id={'home1'} onClick={(e) => {if(files.length!==0){renderFolders("home");toggleFolder(e,'home');props.changeDir('home')}}}>Home</button>
                <ul className="folder-ul hidden" id="home">
                    {visible}
                </ul>
            </li>
        </ul>
    </div>
    );
}

export default FolderLoad;
