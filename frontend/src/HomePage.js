import { Link } from "react-router-dom";
import React, { useState, useEffect, useRef } from "react";
import { getCookie } from "./Cookie";
import { files } from "./getFiles";

const HomePage = (props) => {
    const [user] = useState(JSON.parse(window.localStorage.getItem("user")));
    const [userId, setId] = useState(getCookie("G_VAR"));
    const [recievedFiles, setFiles] = useState("No Files");

    const loadUserData = () => {
        if (userId === "") {
            const cook = getCookie("G_VAR")
            if (cook) {
                setId(cook);
            }
        }
    }

    const onStartup = useRef(() => {});
    onStartup.current = () => {
        loadUserData();
        files(userId).then((data) => {
            if (data !== "error") {
                setFiles(data.data.data);
            } else {
                console.log(data);
            }
        });
    }

    useEffect(() => {
        onStartup.current();
    }, []);

    return (
    <div className="HomePage">
        Hello {user.rname}!
        <Link to="/logout">Logout</Link>
    </div>
    );
}

export default HomePage;
