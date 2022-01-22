//import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "./styles/ProfilePage.css";

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
            <input className="checkbox" type='checkbox'/>
            <input className="checkbox" type='checkbox'/><input className="checkbox" type='checkbox'/><input className="checkbox" type='checkbox'/>
        </div>
    </div>
  );
}

export default ProfilePage;