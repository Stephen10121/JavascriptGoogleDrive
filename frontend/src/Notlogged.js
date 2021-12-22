import { Link } from "react-router-dom";
import './styles/Notlogged.css';

const Notlogged = () => {
  const text = [
    'socket.emit("cool", true);',
    "while (true) &#123;hostFiles()&#125;",
    "Math.floor(Math.pi);",
    'alert("Hey there.");',
    'console.log("Hello World");',
    "const numbers = [1, 2, 3, 4, 5];",
    "document.getElementById('root')",
    "function generateString(length) {",
    "let result = ' ';",
    "for ( let i = 0; i < length; i++ ) {",
    "const result = Math.random().toString(36).substring(2,7);"
  ];
  const renderRand = () => {
    return(text.map((it) => {
      return(<p className="free" style={{top:`${Math.floor(Math.random()*70)}%`,left:`${Math.floor(Math.random()*70)}%`}}>{it}</p>);
    }));
  }

  return (
    <div className="not-logged" id="cover">
      <h3 className="welcome-h">Strorage Drive</h3>
      <p className="sub">By: Gruzservices</p>
      <div className="links">
          <Link className="home-a-tags" to="/login">Login</Link>
          <Link className="home-a-tags" to="/signup">Signup</Link>
      </div>
    </div>
  );
}

export default Notlogged;
