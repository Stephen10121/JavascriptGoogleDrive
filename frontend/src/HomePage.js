import { Link } from "react-router-dom";
import React, { useState, useEffect, useRef } from "react";
import { getCookie } from "./Cookie";

const HomePage = (props) => {
    const [user] = useState(JSON.parse(window.localStorage.getItem("user")));
    const [userId, setId] = useState(getCookie("G_VAR"));

    const loadUserData = () => {
        if (userId === "") {
            console.log("true");
            const cook = getCookie("G_VAR")
            if (cook) {
                setId(cook);
            }
        }
        console.log(user);
        console.log(userId);
    }

    const onStartup = useRef(() => {});
    onStartup.current = () => {
        loadUserData();
    }

    useEffect(() => {
        onStartup.current();
    }, []);

    return (
    <div className="HomePage">
        This is the home Home <br/>{user.rname}
        <Link to="/logout">Logout</Link>
    </div>
    );
}

export default HomePage;
