import React, { useState, useEffect, useRef, useContext } from "react";
import Notlogged from "./Notlogged";
import HomePage from "./HomePage";
import { getCookie } from "./Cookie";
import { files } from "./getFiles";
import { UserDataContext, UserDataChangeContext, UserFiles } from './App';
import './styles/App.css';

const CheckLog = () => {
  const userData = useContext(UserDataContext);
  const userDataChange = useContext(UserDataChangeContext);
  const { userFiles, setUserFiles } = useContext(UserFiles);
  const [logged, setLogged] = useState("");

  const isLoggedIn = () => {
    const gotCookie = getCookie("G_VAR");
    console.log(userData);
    if (gotCookie) {
      if (!window.localStorage.user) {
        window.localStorage.user = JSON.stringify(userData);
      }
      if (userData === null) {
        userDataChange(JSON.parse(window.localStorage.getItem("user")));
      }
      files(JSON.parse(window.localStorage.getItem("user")).token).then(({data}) => {
        setUserFiles(data.data);
        setLogged(<HomePage />);
      });
      console.log(userData);
    } else {
      setLogged(<Notlogged/>);
    }
  }

  useEffect(() => {
    isLoggedIn();
    // if (userData !== null) {
    //   console.log(userData);
    //   files(userData.token).then(({data}) => {
    //     setUserFiles(data.data);
    //     setLogged(<HomePage />);
    //   });
    // }
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