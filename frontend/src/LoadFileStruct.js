import React, { useEffect, useRef, useState } from "react";
import './styles/FileStruct.css';

const FileLoad = (props) => {
    const [files, changeFiles] = useState(JSON.parse(window.localStorage.getItem("user")).files);
    const [visible, changeVisible] = useState(<button onClick={() => showFiles("home")}>Root</button>);

    const onStartup = useRef(() => {});
    onStartup.current = () => {
        console.log('loading files');
    }

    const convertToJson = (theFiles) => {
        const output = {};
        let current;

        for (const path of theFiles) {
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
        return(output);
    }

    const showFiles = (where) => {
        const newFileLocation = convertToJson(files)[where];
        console.log("showing files");
        console.log(newFileLocation);
        //const newStruct = newFileLocation.map((file) => {
        //    <div><button>{file}</button><br/></div>
        //});
        //changeVisible(newStruct);
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
