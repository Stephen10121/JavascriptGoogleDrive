import React, { useState, useEffect, useRef } from "react";
import Notlogged from "./Notlogged";
import HomePage from "./HomePage";
import './styles/App.css';

const getCookie = (name) => {
  var dc = document.cookie;
  var prefix = name + "=";
  var begin = dc.indexOf("; " + prefix);
  if (begin === -1) {
      begin = dc.indexOf(prefix);
      if (begin !== 0) return null;
  }
  else
  {
      begin += 2;
      var end = document.cookie.indexOf(";", begin);
      if (end === -1) {
      end = dc.length;
      }
  }
  return decodeURI(dc.substring(begin + prefix.length, end));
}

const CheckLog = (props) => {
  const [id, setId] = useState("");
  const [logged, setLogged] = useState("");

  const isLoggedIn = () => {
    const gotCookie = getCookie("G_VAR");
    if (gotCookie) {
      setId(gotCookie);
      if (!window.localStorage.user) {
        window.localStorage.user = JSON.stringify(props.userInfo);
      }
      setLogged(<HomePage id={id}/>);
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