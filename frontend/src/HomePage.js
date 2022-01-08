import { Link } from "react-router-dom";
import React, { useState, useEffect, useRef } from "react";
import FolderLoad from './LoadFolderStruct';
import FileLoad from "./LoadFileStruct";
import { convertToJson } from "./jsonIt";
import { getCookie } from "./Cookie";
import './styles/mainPage.css';

const HomePage = (props) => {
    const [user] = useState(JSON.parse(window.localStorage.getItem("user")));
    const [userId, setId] = useState(getCookie("G_VAR"));
    const [files, changeFiles] = useState([]);
    const [currentPath, changeCurrentPath] = useState('home');

    const loadUserData = () => {
        if (userId === "") {
            const cook = getCookie("G_VAR");
            if (cook) {
                setId(cook);
            }
        }
    }

    const showFiles = (where) => {
        let newFileLocation;
        if (where.includes('/')) {
            where = where.replace("/",".");
            newFileLocation = Object.keys(where.split('.').reduce((o,i)=> o[i], convertToJson(user.files)));
        }
        else {
            newFileLocation = Object.keys(convertToJson(user.files)[where]);
        }
        let newFolders = [];
        for (const checkFile of newFileLocation) {
            if (checkFile.includes(".")) {
                newFolders.push(checkFile);
            }
        }
        changeCurrentPath(where);
        changeFiles(newFolders);
    }

    const onStartup = useRef(() => {});
    onStartup.current = () => {
        loadUserData();
        console.log(user);
    }

    useEffect(() => {
        onStartup.current();
    }, []);

    return (
    <div className="HomePage">
        <div className="taskbar">
            <div className="profile">
                <button title="Your Profile" className="profile-button">
                    profile
                </button>
            </div>
            <div className="upload-icon">
                <button title="Upload a file or folder">
                    <img src="./icons/upload.svg" alt="Upload"/>
                </button>
            </div>
            <div className="shared-icon">
                <button title="Shared With Me">
                    <img src="./icons/shared.svg" alt="Shared with me"/>
                </button>
            </div>
            <div className="logout-link">
                <Link to="/logout">Logout</Link>
            </div>
        </div>
        <div className="files-box">
            <div className="name-show">
                <p className="name-show-p">{user.rname}</p>
            </div>
            <FolderLoad changeDir={showFiles} id={userId} />
        </div>
        <div className="main-files">
            <FileLoad path={currentPath} files={files} id={userId} owner={user.rname}/>
        </div>
    </div>
    );
}

export default HomePage;
