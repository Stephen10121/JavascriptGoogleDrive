import { Link } from "react-router-dom";
import React, { useState, useEffect, useRef } from "react";
import FileLoad from './LoadFileStruct';
import { getCookie } from "./Cookie";
import './styles/mainPage.css';

const HomePage = (props) => {
    const [user] = useState(JSON.parse(window.localStorage.getItem("user")));
    const [userId, setId] = useState(getCookie("G_VAR"));
    const [currentDirectory, changeCurrentDirectory] = useState("/");

    const loadUserData = () => {
        if (userId === "") {
            const cook = getCookie("G_VAR")
            if (cook) {
                setId(cook);
            }
        }
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
            <FileLoad changeDir={changeCurrentDirectory} id={userId}/>
        </div>
        <div className="main-files">
            {currentDirectory}
        </div>
    </div>
    );
}

export default HomePage;
