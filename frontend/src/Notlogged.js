import './styles/Notlogged.css';
import './styles/GruzAuth.css';
import useWindowDimensions from "./useWindowDimensions";
import useSocket from "./useSocket";
import Cookies from 'universal-cookie';
import { UserDataChangeContext } from './App';
import { useContext } from "react";

const Notlogged = () => {
  const changeUserData = useContext(UserDataChangeContext);

  const { height2, width2 } = useWindowDimensions();
  const socket = useSocket('https://drive.gruzservices.com');

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
      changeUserData(data);
      cookies.set('G_VAR', data.token, { path: '/' });
      window.localStorage.user = JSON.stringify(data);
      socket.off('auth');
    });
    popupCenter({postServer:`https://drive.gruzservices.com/auth`, key: socket.id, title: 'Authenticate', w: 520, h: 570});
  }

  return (
    <>
    <header>
        <h1><a href="/">Gruzservices</a></h1>
        <ul>
            <li><a href="/">Contact</a></li>
            <li><a href="/">About</a></li>
        </ul>
    </header>
    <main>
        <div className="not-logged" id="cover">
            <div className="box-not-logged">
                <h3 className="welcome-h">Storage Drive</h3>
                <p className="sub">Store and Share files online.</p>
                <div className="links">
                    <button id="sauth-login" onClick={() => loginIt()}>Login with Gruzservices <span><img src="https://auth.gruzservices.com/icons/lock.svg" alt="Lock" /></span></button>
                </div>
            </div>
        </div>
        <div className="img-part">
            <img src="/icons/cloud.svg" alt="" />
        </div>
    </main>
    </>
  );
}

export default Notlogged;
