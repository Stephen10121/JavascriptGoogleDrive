import { Link } from "react-router-dom";
import './styles/login.css';
import React, { useState } from "react";
import { Navigate } from "react-router-dom";
const axios = require("axios");

const Login = (props) => {
  const [error, setError] = useState("");
  const [redirect, setRedirect] = useState(false);

  const submitForm = (e) => {
    e.preventDefault();
    axios({
      method: 'post',
      url: 'http://192.168.0.24:4000/login',
      data: {
          username: e.target[0].value,
          password: e.target[1].value
      }
    }).catch((error) => {
      if (error.response) {
        setError(error.response.data);
      }
    }).then(res => {
      if (res.status === 200) {
        if (res.data.error !== 200) {
          setError(res.data.key.errorMessage);
        } else {
          setError("");
          document.cookie = `G_VAR=${res.data.key.data.key}`;
          props.setUser(res.data.key.data.userInfo);
          setRedirect("/");
        }
      }
    });
  }

  const checkRedirect = () => {
    if (redirect) {
      return <Navigate to={redirect} />;
    }
  }

  return (
    <div className="Login">
      {checkRedirect()}
      <form className="login-form" onSubmit={submitForm}>
        <p id="error-login">{error}</p>
        <input type="text" name="username" placeholder="Username: " id="username"/>
        <input type="password" name="password" placeholder="Password: " id="password"/>
        <button type="submit">Login</button>
      </form>
      <Link id="login-to-home" to="/">Home</Link>
    </div>
  );
}

export default Login;
