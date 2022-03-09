import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import setTheme from "./setTheme";
import "./styles/ProfilePage.css";
import "./styles/Checkbox.css";

const ProfilePage = (props) => {
    const [profilePic, setProfilePic] = useState(props.profilePic);
    const [user] = useState(JSON.parse(window.localStorage.getItem("user")));
    const [profilePics] = useState(["profile1", "profile2", "profile3", "profile4", "profile5"]);

    const selectTheme = (event, themeMode) => {
        var elems = document.querySelectorAll(".theme-selected");
        [].forEach.call(elems, (el) => {
            el.classList.remove("theme-selected");
        });
        event.target.classList.add("theme-selected");
        if (themeMode === "default") {
            setTheme("rgb(20, 22, 29)", "rgb(33, 40, 68)", "rgb(34, 32, 32)", "rgb(31, 31, 31)", "rgb(54, 54, 54)", "rgb(226, 226, 226)", "invert(0%) sepia(0%) saturate(0%) hue-rotate(155deg) brightness(101%) contrast(101%)", "#00529b", "rgba(190, 230, 248, 0.7)", "rgb(115, 120, 145)", "black", "rgb(86, 90, 109)", "rgb(24, 28, 43)", "rgb(199, 199, 199)");
        } else if (themeMode === "dark") {
            setTheme("#1e1e1e", "#2d2d30", "#252526", "#3e3e42", "#232325", "#dfdfdf", "invert(0%) sepia(0%) saturate(0%) hue-rotate(155deg) brightness(101%) contrast(101%)", "#00529b", "rgba(190, 230, 248, 0.7)", "#3e3e42", "#dfdfdf", "#1b1b1b", "#173a52", "#000000");
        } else if (themeMode === "light") {
            setTheme("#202936", "#9c9c9c", "#c4c4c4", "#3e3e42", "#232325", "#dfdfdf", "invert(0%) sepia(0%) saturate(0%) hue-rotate(155deg) brightness(101%) contrast(101%)", "#00529b", "rgba(190, 230, 248, 0.7)", "#7a7a7c", "#dfdfdf", "#555555", "#383838", "#000000");
        }
        localStorage.setItem("themeMode", themeMode);
    }

    const onStartup = useRef(() => {});
    onStartup.current = () => {
        document.getElementById(`${localStorage.getItem("themeMode")}-theme`).classList.add('theme-selected');
    }

    useEffect(() => {
        onStartup.current();
    }, []);

    useEffect(() => {
        console.log('a change');
    }, [props.profilePic]);

    return (
        <div className="ProfilePage">
            <div className="taskbar">
                <div className="home-icon">
                    <Link to="/" title="Go Home">
                        <img src="./icons/house.svg" className="image-icon" alt="house icon"/>
                    </Link>
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
            <div className="profile-settings">
                <div className="profile-grid profile-theme">
                    <h1>Theme</h1>
                    <div className="profile-theme-themes">
                        <button id="default-theme" title="Default Theme" onClick={(e) => selectTheme(e, "default")}></button>
                        <button id="light-theme" title="Light Theme" onClick={(e) => selectTheme(e, "light")}></button>
                        <button id="dark-theme" title="Dark Theme" onClick={(e) => selectTheme(e, "dark")}></button>
                    </div>
                </div>
                <div className="profile-grid profile-pic">
                    <h1>Profile picture</h1>
                    <div className="profile-images">
                            <button className="name-profile" onClick={(e) => {props.setProfilePic(`name-profile`)}}>
                                    <p>{user.usersRName.charAt(0)}</p>
                            </button>
                        {profilePics.map((thePic, index) => {
                            return(
                                <button key={index} className={user.usersProfile === thePic ? "current-image": ""} onClick={(e) => {props.setProfilePic(`/profilePics/${thePic}.jpg`)}}>
                                    <img src={`/profilePics/${thePic}.jpg`} alt="profile1"/>
                                </button>
                            );
                        })}
                    </div>
                </div>
                <div className="profile-grid">
                    <h1>sharing</h1>
                    <div className="profile-allow-sharing">
                        <p>Do you want people to share files to you?</p>
                        <input type="checkbox" className="checkbox"/>
                    </div>
                </div>
            </div>
        </div>
    );
}
//<input id="one1" className="checkbox" type='checkbox'/>

export default ProfilePage;