import React, { useState, useEffect, useRef } from "react";
import { Navigate } from "react-router-dom";
import { getCookie } from "./Cookie";
import ProfilePage from "./ProfilePage";
import './styles/App.css';

const Profile = (props) => {
  const [logged, setLogged] = useState("");

  const isLoggedIn = () => {
    const gotCookie = getCookie("G_VAR");
    if (gotCookie) {
      if (!window.localStorage.user) {
        window.localStorage.user = JSON.stringify(props.userInfo);
      }
      setLogged(<ProfilePage />);
    } else {
      setLogged(<Navigate to='/login'/>);
    }
  }

  const onStartup = useRef(() => {});
  onStartup.current = () => {
    isLoggedIn();
  }

  useEffect(() => {
      onStartup.current();
  }, []);

  return (
    <div className="Profile">
      {logged}
    </div>
  );
}

export default Profile;