import React, { useState, useEffect, useRef } from "react";
import { BrowserRouter, Routes, Route} from 'react-router-dom';
import Login from './Login';
import Signup from './Signup';
import CheckLog from "./CheckLog";
import setTheme from "./setTheme";
import Logout from "./Logout";
import Profile from "./Profile";
import './styles/App.css';

const App = () => {
  const [userInfo, setUserInfo] = useState(null);

  const setUserTheme = () => {
    const themeMode = localStorage.getItem("themeMode");
    if (themeMode === "default") {
        setTheme("rgb(20, 22, 29)", "rgb(33, 40, 68)", "rgb(34, 32, 32)", "rgb(31, 31, 31)", "rgb(54, 54, 54)", "rgb(226, 226, 226)", "invert(0%) sepia(0%) saturate(0%) hue-rotate(155deg) brightness(101%) contrast(101%)", "#00529b", "rgba(190, 230, 248, 0.7)", "rgb(115, 120, 145)", "black", "rgb(86, 90, 109)", "rgb(24, 28, 43)", "rgb(199, 199, 199)");
    } else if (themeMode === "dark") {
        setTheme("#1e1e1e", "#2d2d30", "#252526", "#3e3e42", "#232325", "#dfdfdf", "invert(0%) sepia(0%) saturate(0%) hue-rotate(155deg) brightness(101%) contrast(101%)", "#00529b", "rgba(190, 230, 248, 0.7)", "#3e3e42", "#dfdfdf", "#1b1b1b", "#173a52", "#000000");
    } else if (themeMode === "light") {
        setTheme("#202936", "#9c9c9c", "#c4c4c4", "#3e3e42", "#232325", "#dfdfdf", "invert(0%) sepia(0%) saturate(0%) hue-rotate(155deg) brightness(101%) contrast(101%)", "#00529b", "rgba(190, 230, 248, 0.7)", "#7a7a7c", "#dfdfdf", "#555555", "#383838", "#000000");
    }
  }

  const onStartup = useRef(() => {});
    onStartup.current = () => {
        setUserTheme();
    }

    useEffect(() => {
        onStartup.current();
    }, []);

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route exact path="/" element={<CheckLog userInfo={userInfo} setUser={setUserInfo} />} />
          <Route path="/login" element={<Login setUser={setUserInfo} />} />
          <Route path="/signup" element={<Signup setUser={setUserInfo} />} />
          <Route path="/profile" element={<Profile userInfo={userInfo} setUser={setUserInfo} />} />
          <Route exact path="/logout" element={<Logout />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;

/*
<Link className="App-link" to="/signup">signup</Link>
<Link className="App-link" to="/login">login</Link>
*/