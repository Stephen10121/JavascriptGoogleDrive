import React, { useState, useEffect, useRef, useContext } from "react";
import Notlogged from "./Notlogged";
import HomePage from "./HomePage";
import { getCookie } from "./Cookie";
import { UserDataContext, UserDataChangeContext } from './App';
import './styles/App.css';

const CheckLog = () => {
  const userData = useContext(UserDataContext);
  const userDataChange = useContext(UserDataChangeContext);
  const [logged, setLogged] = useState("");

  const isLoggedIn = () => {
    const gotCookie = getCookie("G_VAR");
    if (gotCookie) {
      if (!window.localStorage.user) {
        window.localStorage.user = JSON.stringify(userData);
      }
      if (userData === null) {
        userDataChange(JSON.parse(window.localStorage.getItem("user")));
      }
      setLogged(<HomePage />);
    } else {
      setLogged(<Notlogged/>);
    }
  }

  useEffect(() => {
    if (userData !== null) {
      setLogged(<HomePage />);
    }
  }, [userData]);

  const onStartup = useRef(() => {});
  onStartup.current = () => {
    isLoggedIn();
  }

  useEffect(() => {
      onStartup.current();
  }, []);

  return (
    <div className="App">
      {logged}
    </div>
  );
}

export default CheckLog;