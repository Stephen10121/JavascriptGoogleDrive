import React, { useEffect, useRef, useState, useContext } from "react";
import { Link } from "react-router-dom";
import setTheme from "./setTheme";
import { UserDataContext, UserDataChangeContext } from './App';
import sendProfile from "./sendProfile";
import "./styles/ProfilePage.css";
import "./styles/Checkbox.css";

const ProfilePage = (props) => {
    const userData = useContext(UserDataContext);
    const [user] = useState(userData.userData);
    const changeUser  = useContext(UserDataChangeContext);
    const [usersProfile, changeUsersProfile] = useState(JSON.parse(user.usersProfile));
    const [profilePics] = useState(["profile1.jpg", "profile2.jpg", "profile3.jpg", "profile4.jpg", "profile5.jpg"]);
    const [notMessage, setNotMesssage] = useState("Error");
    const [notAlert, setNotAlert] = useState(true);

    const selectTheme = async (event, themeMode) => {
        var elems = document.querySelectorAll(".theme-selected");
        [].forEach.call(elems, (el) => {
            el.classList.remove("theme-selected");
        });
        event.target.classList.add("theme-selected");
        if (themeMode === "default") {
            setTheme("rgb(20, 22, 29)", "rgb(33, 40, 68)", "rgb(34, 32, 32)", "rgb(31, 31, 31)", "rgb(54, 54, 54)", "rgb(226, 226, 226)", "invert(0%) sepia(0%) saturate(0%) hue-rotate(155deg) brightness(101%) contrast(101%)", "#00529b", "rgba(190, 230, 248, 0.7)", "rgb(115, 120, 145)", "black", "rgb(86, 90, 109)", "rgb(24, 28, 43)", "rgb(199, 199, 199)");
        } else if (themeMode === "dark") {
            setTheme("#1e1e1e", "#2d2d30", "#252526", "#3e3e42", "#232325", "#dfdfdf", "invert(0%) sepia(0%) saturate(0%) hue-rotate(155deg) brightness(101%) contrast(101%)", "#00529b", "rgba(190, 230, 248, 0.7)", "#1e1e1e", "#dfdfdf", "#1b1b1b", "#333374", "#000000");
        } else if (themeMode === "light") {
            setTheme("#202936", "#dfdfdf", "#d3d3d3", "#3e3e42", "#232325", "#dfdfdf", "invert(0%) sepia(0%) saturate(0%) hue-rotate(155deg) brightness(101%) contrast(101%)", "#00529b", "rgba(190, 230, 248, 0.7)", "#7a7a7c", "#dfdfdf", "#555555", "#383838", "#000000");
        }
        localStorage.setItem("themeMode", themeMode);
        const newProf = usersProfile;
        newProf.theme = themeMode;
        await saveProfileData(newProf);
    }

    const setProfilePic = async (what) => {
        const newProf = usersProfile;
        newProf.profile = what;
        await saveProfileData(newProf);
    }

    const saveProfileData = async (newData) => {
        const newUser = JSON.parse(window.localStorage.getItem("user"));
        newUser.userData.usersProfile = JSON.stringify(newData);
        const resultSave = await sendProfile(userData.token, newData);
        if (resultSave === "good") {
            changeUsersProfile(newData);
            changeUser(newUser);
            localStorage.removeItem("user");
            window.localStorage.user = JSON.stringify(newUser);
            setNotAlert(false);
            setNotMesssage("Success");
            document.getElementById("alert-box").style.top = "30px";
        } else {
            setNotAlert(true);
            setNotMesssage("Error saving settings");
            document.getElementById("alert-box").style.top = "30px";
        }
    }

    const setShare = async (what) => {
        const newProf = usersProfile;
        newProf.sharing = what;
        await saveProfileData(newProf);
    }

    const onStartup = useRef(() => {});
    onStartup.current = () => {
        document.getElementById(`${usersProfile.theme}-theme`).classList.add('theme-selected');
        if (usersProfile.sharing) {
            document.getElementById("share-checkbox").checked = true;
        }
    }

    useEffect(() => {
        console.log(usersProfile);
        onStartup.current();
    }, []);

    useEffect(() => {
    }, [props.profilePic]);

    return (
        <div className="ProfilePage">
            <div className="taskbar">
                <div className="home-icon">
                    <Link to="/" title="Go Home">
                        <img src="./icons/house.svg" className="image-icon" alt="house icon"/>
                    </Link>
                </div>
                {usersProfile.sharing ? 
                    <div className="shared-icon">
                        <Link to="/shared" title="Shared With Me" className={!usersProfile.sharing ? "blocked" : ""}>
                            <img src="./icons/shared.svg" className="image-icon" alt="Shared with me"/>
                        </Link>
                    </div>
                : null}
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
                                <button key={index} id={`/profilePics/${thePic}`} className={usersProfile.profile === `/profilePics/${thePic}` ? "current-image": ""} onClick={(e) => {setProfilePic(`/profilePics/${thePic}`);}}>
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
                        <input type="checkbox" onChange={(e) => {setShare(e.target.checked)}} className="checkbox" id="share-checkbox"/>
                    </div>
                </div>
                <div id="alert-box" className={notAlert ? "alert-box alert-red" : "alert-box alert-green"}>
                    <div>
                        {notMessage}
                    </div>
                    <button onClick={() => {document.getElementById("alert-box").style.top = "-100px"}}>
                    &#10006;
                    </button>
                </div>
            </div>
        </div>
    );
}
//<input id="one1" className="checkbox" type='checkbox'/>

export default ProfilePage;