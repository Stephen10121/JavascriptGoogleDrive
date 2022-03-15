import { Link } from "react-router-dom";
import React, { useState, useEffect, useRef, useContext } from "react";
import FolderLoad from './LoadFolderStruct';
import FileLoad from "./LoadFileStruct";
import convertToJson from "./jsonIt";
import { getCookie } from "./Cookie";
import './styles/mainPage.css';
import { UserDataContext, UserFiles } from './App';
import FileUpload from "./FileUpload";

String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.split(search).join(replacement);
};

const HomePage = (props) => {
    const userData = useContext(UserDataContext);
    const {userFiles, setUserFiles} = useContext(UserFiles);
    const [user, setUser] = useState(userData);
    const [userProfile, setUserProfile] = useState(JSON.parse(userData.userData.usersProfile));
    const [userId, setId] = useState(getCookie("G_VAR"));
    const [files, changeFiles] = useState([]);
    const [currentPath, changeCurrentPath] = useState('home');

    const loadUserData = () => {
        console.log(userData.userData);
        console.log(userProfile);
        if (userId === "") {
            const cook = getCookie("G_VAR");
            if (cook) {
                setId(cook);
            }
        }
    }

    const showFiles = (where) => {
        where = where.replaceAll("/",".");
        let newFileLocation = Object.keys(where.split('.').reduce((o,i)=> o[i], convertToJson(userFiles)));
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
    }

    useEffect(() => {
        onStartup.current();
    }, []);

    const setTheFiles = (what) => {
        setUserFiles(what);
    }

    return (
    <div className="HomePage">
        <div className="taskbar">
            <div className="profile">
                <Link to="/profile" title="Your Profile" className="profile-button">
                    <img src={`/profilePics/${userProfile.profile}`} alt="Profile Pic"/>
                </Link>
            </div>
            <div className="upload-icon">
                <FileUpload changefiles={setTheFiles} files={userFiles} id={userId} path={currentPath} updater={showFiles}/>
            </div>
            <div className="shared-icon">
                <button title="Shared With Me">
                    <img src="./icons/shared.svg" className="image-icon" alt="Shared with me"/>
                </button>
            </div>
            <div className="logout-link">
                <Link to="/logout">Logout</Link>
            </div>
        </div>
        <div className="files-box">
            <div className="name-show">
                <p className="name-show-p">{user.userData.usersRName}</p>
            </div>
            <FolderLoad changeDir={showFiles} id={userId} usern={user.userData.usersName} files={files}/>
        </div>
        <div className="main-files">
            <FileLoad path={currentPath} files={files} id={userId} owner={user.userData.usersRName}/>
        </div>
    </div>
    );
}

export default HomePage;
