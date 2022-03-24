import File from "./File";
import './styles/FileStruct.css';

const FileLoad = (props) => {

    const checkEmpty = (file) => {
        if (file === null) return(<p id="file-empty-p">No Files</p>);
        if (file.length === 0) return(<p id="file-empty-p">No Files</p>);
        return(<p></p>);
    }

    return (
    <div className="file-ind-struct">
        {checkEmpty(props.files)}
        {props.files.map((file, index) => <File id={props.id} owner={props.owner} key={index} path={props.path} file={file}/>)}
    </div>
    );
}

export default FileLoad;