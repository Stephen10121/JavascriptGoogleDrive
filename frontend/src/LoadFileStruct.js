import React, { useEffect, useRef, useState } from "react";
import './styles/FileStruct.css';

const FileLoad = (props) => {
    const [files, changeFiles] = useState(JSON.parse(window.localStorage.getItem("user")).files);
    const [visible, changeVisible] = useState(<button onClick={() => showFiles("/")}>Root</button>);

    const onStartup = useRef(() => {});
    onStartup.current = () => {
        convertToJson();
    }

    const convertToJson = () => {
        const output = {};
        let current;

        for (const path of files) {
            current = output;

            for (const segment of path.split('/')) {
                if (segment !== '') {
                    if (!(segment in current)) {
                        current[segment] = {};
                    }
                    current = current[segment];
                }
            }
        }
        console.log(output);
        changeFiles(JSON.stringify(output));
    }

    const showFiles = (where) => {
    }

    useEffect(() => {
        onStartup.current();
    }, []);

    return (
    <div className="file-struct">
        {visible}
        {files}
    </div>
    );
}

export default FileLoad;
