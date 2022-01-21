import { Link } from "react-router-dom";
import './styles/login.css';
import React, { useState } from "react";
import { Navigate } from "react-router-dom";
const axios = require("axios");

const Signup = (props) => {
  const [error, setError] = useState("");
  const [redirect, setRedirect] = useState(false);

  const submitForm = (e) => {
    e.preventDefault();
    const data = {
      rname: e.target[0].value,
      email: e.target[1].value,
      username: e.target[2].value,
      password: e.target[3].value,
      rpassword: e.target[4].value
    }
    axios({
      method: 'post',
      url: '/signup',
      data: {
          name: data.rname,
          email: data.email,
          username: data.username,
          password: data.password,
          rpassword: data.rpassword
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
        <input type="text" name="name" placeholder="Full name" id="name"/>
        <input type="email" name="email" placeholder="Email" id="email"/>
        <input type="text" name="username" placeholder="Username" id="username"/>
        <input type="password" name="password" placeholder="Password" id="password"/>
        <input type="password" name="rpassword" placeholder="Repeat password" id="rpassword"/>
        <button type="submit">Login</button>
      </form>
      <Link id="login-to-home" to="/">Home</Link>
    </div>
  );
}

export default Signup;