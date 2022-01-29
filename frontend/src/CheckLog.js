import React, { useState, useEffect, useRef } from "react";
import Notlogged from "./Notlogged";
import HomePage from "./HomePage";
import { getCookie } from "./Cookie";
import './styles/App.css';

const CheckLog = (props) => {
  const [logged, setLogged] = useState("");

  const isLoggedIn = () => {
    const gotCookie = getCookie("G_VAR");
    if (gotCookie) {
      if (!window.localStorage.user) {
        window.localStorage.user = JSON.stringify(props.userInfo);
      }
      setLogged(<HomePage />);
    } else {
      setLogged(<Notlogged/>);
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
    <div className="App">
      {logged}
    </div>
  );
}

export default CheckLog;