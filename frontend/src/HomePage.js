import { Link } from "react-router-dom";
import React, { useState, useEffect, useRef, useContext } from "react";
import FolderLoad from './LoadFolderStruct';
import FileLoad from "./LoadFileStruct";
import convertToJson from "./jsonIt";
import { getCookie } from "./Cookie";
import newFolderPost from "./newFolderPost";
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
    const [inputPopup, changeInputPopup] = useState(null);
    const [folderPostMessage, setFolderPostMessage] = useState(null);

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

    const showRightClick = (xAxis, yAxis, contextMenu) => {
        contextMenu.style.left = `${xAxis}px`;
        contextMenu.style.top = `${yAxis}px`;
        contextMenu.style.visibility = "visible";
    }

    const hideRightClick = () => {
        const contextMenu = document.querySelector(".right-click");
        contextMenu.style.visibility = "hidden";
    }

    const rightClickListener = () => {
        const contextMenu = document.querySelector(".right-click");
        const folderBox = document.querySelector("#folder-box");

        folderBox.addEventListener("contextmenu", (e) => {
            e.preventDefault();
            let x = e.pageX, y = e.pageY,
            winWidth = window.innerWidth,
            winHeight = window.innerHeight,
            cmWidth = contextMenu.offsetWidth,
            cmHeight = contextMenu.offsetHeight;
            showRightClick(x > winWidth - cmWidth ? winWidth - cmWidth : x, y > winHeight - cmHeight ? winHeight - cmHeight : y, contextMenu);
        });

        document.addEventListener("click", (e) => {
            if (contextMenu.style.visibility !== "visible") {return;}
            const pos = {x: parseInt(contextMenu.style.left.replace("px", "")), y: parseInt(contextMenu.style.top.replace("px", "")), width: contextMenu.offsetWidth, height: contextMenu.offsetHeight}
            if ((pos.x + pos.width) >= e.pageX && e.pageX >= pos.x && (pos.y + pos.height) >= e.pageY && e.pageY >= pos.y) {
                return;
            }
            hideRightClick();
        });
    }

    const textPopup = async (placeholder, callback) => {
        changeInputPopup(
        <div className="input-popup">
            <input type="text" placeholder={placeholder} onKeyDown={(e) => {if (e.key==="Enter"){callback(e.target.value)}}}/>
            <button onClick={() => {changeInputPopup(null)}}>&#10006;</button>
        </div>);
    }

    const newFolder = async (folderName) => {
        const resulstpost2 = await newFolderPost(userId, currentPath, folderName);
        if (typeof resulstpost2 === "object") {
            console.log(typeof resulstpost2);
            setUserFiles(resulstpost2);
            setFolderPostMessage("Success!");
        } else {
            setFolderPostMessage(resulstpost2);
        }
    }

    const onStartup = useRef(() => {});
    onStartup.current = () => {
        loadUserData();
        rightClickListener();
    }

    const begone = () => {
        setFolderPostMessage(null);
    }

    useEffect(() => {
        onStartup.current();
    }, []);

    const setTheFiles = (what) => {
        setUserFiles(what);
    }

    return (
    <div className="HomePage">
        {inputPopup}
        <div className="right-click">
            <ul>
                <li><button onClick={async () => {hideRightClick();textPopup("Folder Name", newFolder)}}>New Folder</button></li>
                <li><button onClick={() => {hideRightClick();}} className={currentPath.includes(".") ? null : "non-selectable"}>Delete Folder</button></li>
                <li><button onClick={() => {hideRightClick();}} className={currentPath.includes(".") ? null : "non-selectable"}>Move Folder</button></li>
                <li><button onClick={() => {hideRightClick();}} className={currentPath.includes(".") ? null : "non-selectable"}>Share Folder</button></li>
            </ul>
        </div>
        <div className="taskbar">
            <div className="profile">
                <Link to="/profile" title="Your Profile" className="profile-button">
                    <img src={`${userProfile.profile}`} alt="Profile Pic"/>
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
        <div className="files-box" id="folder-box">
            <div className="name-show">
                <p className="name-show-p">{user.userData.usersRName}</p>
            </div>
            <FolderLoad changeDir={showFiles} id={userId} usern={user.userData.usersName} files={files}/>
        </div>
        <div className="main-files">
            <FileLoad path={currentPath} files={files} id={userId} owner={user.userData.usersRName}/>
        </div>
        {folderPostMessage !==null ? <div id="file-popup" className='file-upload-popup'>
                <p>{folderPostMessage}</p>
                <button onClick={begone}>&#10006;</button>
            </div>: null}
    </div>
    );
}

export default HomePage;
