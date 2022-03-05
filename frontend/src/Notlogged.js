import { Navigate } from "react-router-dom";
import './styles/Notlogged.css';
import './styles/GruzAuth.css';
import useWindowDimensions from "./useWindowDimensions";
import useSocket from "./useSocket";
import Cookies from 'universal-cookie';
import { useState } from "react";

const Notlogged = (props) => {
  const { height2, width2 } = useWindowDimensions();
  const [nav, setNav] = useState(<></>);
  const socket = useSocket('http://192.168.0.24:5400');

  const popupCenter = ({postServer, key, title, w, h}) => {
    // Fixes dual-screen position                             Most browsers      Firefox
    const dualScreenLeft = window.screenLeft !==  undefined ? window.screenLeft : window.screenX;
    const dualScreenTop = window.screenTop !==  undefined   ? window.screenTop  : window.screenY;
    const url = `https://auth.gruzservices.com/auth?website=${postServer}&key=${key}`
    const width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : width2;
    const height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : height2;

    const systemZoom = width / window.screen.availWidth;
    const left = (width - w) / 2 / systemZoom + dualScreenLeft
    const top = (height - h) / 2 / systemZoom + dualScreenTop
    const newWindow = window.open(url, title, 
    `
    scrollbars=yes,
    width=${w / systemZoom}, 
    height=${h / systemZoom}, 
    top=${top}, 
    left=${left}
    `
    )

    if (window.focus) {
      newWindow.focus();
    }
  }

  const loginIt = () => {
    const cookies = new Cookies();
    socket.on("auth", (data) => {
      cookies.set('G_VAR', data, { path: '/' });
      socket.off('auth');
      //setNav(<Navigate to="/test" />);
    });
    //${window.location.href}
    popupCenter({postServer:`http://192.168.0.24:5400/auth`, key: socket.id, title: 'Authenticate', w: 520, h: 570});
  }

  return (
    <>
    <header>
        <h1><a href="#">Gruzservices</a></h1>
        <ul>
            <li><a href="#">Contact</a></li>
            <li><a href="#">About</a></li>
        </ul>
    </header>
    <main>
        <div class="not-logged" id="cover">
            <div class="box-not-logged">
                {nav}
                <h3 class="welcome-h">Storage Drive</h3>
                <p class="sub">Store and Share files online.</p>
                <div class="links">
                    <button id="sauth-login" onClick={() => loginIt()}>Login with Gruzservices <span><img src="https://auth.gruzservices.com/icons/lock.svg" alt="Lock" /></span></button>
                </div>
            </div>
        </div>
        <div class="img-part">
            <img src="/icons/cloud.svg" alt="" />
        </div>
    </main>
    </>
  );
}

export default Notlogged;
