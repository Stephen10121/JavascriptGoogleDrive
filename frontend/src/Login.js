import { Link } from "react-router-dom";
import './styles/login.css';

const Login = () => {
  return (
    <div className="Login">
      login page
      <Link to="/">Home</Link>
    </div>
  );
}

export default Login;
