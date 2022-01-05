import React, { useEffect, useRef, useState } from "react";
import './styles/FileStruct.css';

const FileLoad = (props) => {
    const [files] = useState(JSON.parse(window.localStorage.getItem("user")).files);
    const [visible, changeVisible] = useState([]);

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
        console.log(where);
        let newFileLocation;
        if (where.includes('/')) {
            where = where.replace("/",".");
            newFileLocation = Object.keys(where.split('.').reduce((o,i)=> o[i], convertToJson(files)));
        }
        else {
            newFileLocation = Object.keys(convertToJson(files)[where]);
        }
        console.log("showing files");
        let newFolders = [];
        for (const checkFile of newFileLocation) {
            if (!checkFile.includes(".")) {
                newFolders.push(checkFile);
            }
        }
        const newStruct = newFolders.map((file, index) => <button key={index} onClick={() => showFiles(`${where}/${file}`)}>{file}</button>);
        console.log(visible);
        changeVisible(newStruct);
    }

    useEffect(() => {
        onStartup.current();
    }, []);

    return (
    <div className="file-struct">
        <button onClick={() => showFiles("home")}>Root</button>
        {visible}
    </div>
    );
}

export default FileLoad;
