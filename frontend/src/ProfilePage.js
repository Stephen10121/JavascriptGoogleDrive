//import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "./styles/ProfilePage.css";
import "./styles/Checkbox.css";

const ProfilePage = (props) => {
  return (
    <div className="ProfilePage">
        <div className="taskbar">
            <div className="home-icon">
                <Link to="/" title="Go Home">
                    <img src="./icons/house.svg" alt="house icon"/>
                </Link>
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
        <div className="profile-settings">
            <ul>
                <li>Theme</li>
                <li>Profile Pic</li>
                <li>Allow sharing</li>
                <li>2 factor auth</li>

            </ul>
        </div>
    </div>
  );
}
//<input id="one1" className="checkbox" type='checkbox'/>

export default ProfilePage;