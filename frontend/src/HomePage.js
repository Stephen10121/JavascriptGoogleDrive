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
    const [files, changeFiles] = useState(userFiles);
    const [currentPath, changeCurrentPath] = useState('home');

    const loadUserData = () => {
        console.log(user);
        console.log(userProfile);
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
            where = where.replaceAll("/",".");
            newFileLocation = Object.keys(where.split('.').reduce((o,i)=> o[i], convertToJson(files)));
        }
        else {
            newFileLocation = Object.keys(convertToJson(files)[where]);
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
    }

    useEffect(() => {
        onStartup.current();
    }, []);

    return (
    <div className="HomePage">
        <div className="taskbar">
            <div className="profile">
                <Link to="/profile" title="Your Profile" className="profile-button">
                    <img src={`/profilePics/${userProfile.profile}`} alt="Profile Pic"/>
                </Link>
            </div>
            <div className="upload-icon">
                <FileUpload usern={user} changeFiles={setUser} changefiles={changeFiles} files={files} id={userId} path={currentPath}/>
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
            <FolderLoad changeDir={showFiles} id={userId} usern={user.userData.usersName}/>
        </div>
        <div className="main-files">
            <FileLoad path={currentPath} files={files} id={userId} owner={user.userData.usersRName}/>
        </div>
    </div>
    );
}

export default HomePage;
