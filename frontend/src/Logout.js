import React, { useState, useEffect, useRef } from "react";
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
    const [log, setLog] = useState(<></>);

    const removeUser = () => {
        const cookie = getCookie("G_VAR");
        if (cookie) {
            axios({
                method: 'post',
                url: '/logout',
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
                setLog(<Navigate to="/" />);
            });
        } else {
            setLog(<Navigate to="/" />);
        }
    }
    const onStartup = useRef(() => {});
    onStartup.current = () => {
        removeUser();
    }

    useEffect(() => {
        onStartup.current();
    }, []);

    return (
    <div className="Logout">
        {log}
        Logging Out<br/>If you are not redirecting, reload the page.
    </div>
    );
}

export default Logout;