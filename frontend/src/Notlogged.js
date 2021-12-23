import { Link } from "react-router-dom";
import './styles/Notlogged.css';

const Notlogged = () => {
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
