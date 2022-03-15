import React, { useEffect, useRef, useState, useContext } from "react";
import { Link } from "react-router-dom";
import setTheme from "./setTheme";
import { UserDataContext, UserDataChangeContext } from './App';
import { sendProfile } from "./sendProfile";
import "./styles/ProfilePage.css";
import "./styles/Checkbox.css";

const ProfilePage = (props) => {
    const userData = useContext(UserDataContext);
    const [user] = useState(userData.userData);
    const changeUser  = useContext(UserDataChangeContext);
    const [usersProfile, changeUsersProfile] = useState(JSON.parse(user.usersProfile));
    const [profilePics] = useState(["profile1.jpg", "profile2.jpg", "profile3.jpg", "profile4.jpg", "profile5.jpg"]);

    const selectTheme = async (event, themeMode) => {
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
        const newProf = usersProfile;
        newProf.theme = themeMode;
        changeUsersProfile(newProf);
        const resultSave = await sendProfile(userData.token, newProf);
    }

    const setProfilePic = async (what) => {
        const newProf = usersProfile;
        newProf.profile = what;
        changeUsersProfile(newProf);
        const resultSave = await sendProfile(userData.token, newProf);
    }

    const setShare = async (what) => {
        const newProf = usersProfile;
        newProf.sharing = what;
        changeUsersProfile(newProf);
        const newUser = user;
        newUser.usersProfile = JSON.stringify(newProf);
        console.log(user);
        window.localStorage.user = JSON.stringify(newUser);
        const resultSave = await sendProfile(userData.token, newProf);
    }

    const onStartup = useRef(() => {});
    onStartup.current = () => {
        console.log(user);
        console.log(usersProfile);
        document.getElementById(`${usersProfile.theme}-theme`).classList.add('theme-selected');
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
                        {profilePics.map((thePic, index) => {
                            return(
                                <button key={index} className={usersProfile.profile === thePic ? "current-image": ""} onClick={(e) => {setProfilePic(`/profilePics/${thePic}`)}}>
                                    <img src={`/profilePics/${thePic}`} alt="profile1"/>
                                </button>
                            );
                        })}
                    </div>
                </div>
                <div className="profile-grid">
                    <h1>sharing</h1>
                    <div className="profile-allow-sharing">
                        <p>Do you want people to share files to you?</p>
                        <input type="checkbox" onChange={(e) => {setShare(e.target.checked)}} className="checkbox"/>
                    </div>
                </div>
            </div>
        </div>
    );
}
//<input id="one1" className="checkbox" type='checkbox'/>

export default ProfilePage;