import React from "react";
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
        const cookie = getCookie("G_VAR");
        if (cookie) {
            axios({
                method: 'post',
                url: 'https://drive.gruzservices.com/logout',
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
            });
        }
        return(<Navigate to="/login" />);
    }

    return (
    <div className="Logout">
        {removeUser()}
        Logging Out
    </div>
    );
}

export default Logout;