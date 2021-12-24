import React, { useEffect, useRef } from "react";
import { Navigate } from "react-router-dom";
const axios = require("axios");

const getCookie = (name) => {
    var dc = document.cookie;
    var prefix = name + "=";
    var begin = dc.indexOf("; " + prefix);
    if (begin === -1) {
        begin = dc.indexOf(prefix);
        if (begin !== 0) return null;
    }
    else
    {
        begin += 2;
        var end = document.cookie.indexOf(";", begin);
        if (end === -1) {
        end = dc.length;
        }
    }
    return decodeURI(dc.substring(begin + prefix.length, end));
}

const Logout = () => {
    const removeUser = () => {
        console.log("logging out");
        const cookie = getCookie("G_VAR");
        if (cookie) {
            axios({
                method: 'post',
                url: 'http://192.168.0.24:4000/logout',
                data: {
                    id: cookie
                }
            }).catch((error) => {
                if (error.response) {
                    console.log(error);
                }
            }).then(res => {
                document.cookie = 'G_VAR=; Max-Age=-99999999;';  
                localStorage.removeItem("user");
                console.log(res);
                return(<Navigate to="/" />);
            });
        } else {
            return(<Navigate to="/" />);
        }
    }

    return (
    <div className="Logout">
        {removeUser()}
        Logging Out
    </div>
    );
}

export default Logout;