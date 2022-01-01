import React, { useEffect, useRef, useState } from "react";
import { files } from "./getFiles";
import './styles/FileStruct.css';

const FileLoad = (props) => {
    const [gotFiles, changeFiles] = useState('');
    const [visible, changeVisible] = useState(<button onClick={() => showFiles("/")}>Root</button>);

    const onStartup = useRef(() => {});
    onStartup.current = () => {
        files(props.id).then((data) => {
            if (data !== "error") {
                changeFiles(data.data.data);
            }
            console.log(data);
        });
    }

    const showFiles = (where) => {
        console.log(where);
        console.log(gotFiles);
    }

    useEffect(() => {
        onStartup.current();
    }, []);

    return (
    <div className="file-struct">
        {visible}
    </div>
    );
}

export default FileLoad;
