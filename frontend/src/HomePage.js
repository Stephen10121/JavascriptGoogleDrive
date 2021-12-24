import { Link } from "react-router-dom";
import React, { useState, useEffect, useRef } from "react";

const HomePage = (props) => {
    const [user] = useState(JSON.parse(window.localStorage.getItem("user")));
    /*
    const userNotNull = () => {
        console.log(user);
    }

    const onStartup = useRef(() => {});
    onStartup.current = () => {
        userNotNull();
    }

    useEffect(() => {
        onStartup.current();
    }, []);*/

    return (
    <div className="HomePage">
        This is the home Home <br/>{props.id}
        <Link to="/logout">Logout</Link>
    </div>
    );
}

export default HomePage;
