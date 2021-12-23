import { Link } from "react-router-dom";
import React, { useState, useEffect, useRef } from "react";
import { Navigate } from "react-router-dom";
const axios = require("axios");

const getCookie = (name) => {
    var dc = document.cookie;
    var prefix = name + "=";
    var begin = dc.indexOf("; " + prefix);
    if (begin == -1) {
        begin = dc.indexOf(prefix);
        if (begin != 0) return null;
    }
    else
    {
        begin += 2;
        var end = document.cookie.indexOf(";", begin);
        if (end == -1) {
        end = dc.length;
        }
    }
    return decodeURI(dc.substring(begin + prefix.length, end));
  }

const HomePage = (props) => {
    const [user, setUser] = useState(props.userInfo);

    const userNotNull = () => {
        if (user == null || user == undefined) {
            console.log("truefr");
            axios({
                method: 'post',
                url: 'http://192.168.0.24:4000/userinfo',
                data: {
                    id: getCookie("G_VAR")
                }
              }).catch((error) => {
                if (error.response) {
                  console.log(error);
                }
              }).then(res => {
                if (res.status === 200) {
                  console.log(res.data);
                  props.setUser(res.data);
                }
            });
        }
    }

    const onStartup = useRef(() => {});
    onStartup.current = () => {
        userNotNull();
    }

    useEffect(() => {
        onStartup.current();
    }, []);

    return (
    <div className="HomePage">
        This is the home Home {user}
    </div>
    );
}

export default HomePage;
