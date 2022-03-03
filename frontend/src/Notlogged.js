import { Link } from "react-router-dom";
import './styles/Notlogged.css';
import './styles/GruzAuth.css';
import useWindowDimensions from "./useWindowDimensions";
import useSocket from "./useSocket";

const Notlogged = (props) => {
  const { height2, width2 } = useWindowDimensions();
  const socket = useSocket('https://auth.gruzservices.com');

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
      socket.emit('test', "test");
      popupCenter({postServer:`${window.location.href}auth`, key: "socket.id", title: 'Authenticate', w: 520, h: 570});
  }

  return (
    <div className="not-logged" id="cover">
      <h3 className="welcome-h">Storage Drive</h3>
      <p className="sub">By: Gruzservices</p>
      <div className="links">
        <button id="sauth-login" onClick={() => loginIt()}>Login with Gruzservices <span><img src="https://auth.gruzservices.com/icons/lock.svg" alt="Lock" /></span></button>
      </div>
    </div>
  );
}

export default Notlogged;
