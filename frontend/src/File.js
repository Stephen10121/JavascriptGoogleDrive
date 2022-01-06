import { getData } from './getFileData';
import { getType } from "./fileType";
import './styles/File.css';

const File = (props) => {
    const toggle = (e) => {
        let box = document.getElementById(`${props.file}1`);
        let rect = box.getBoundingClientRect();
        let width = box.offsetWidth;
        let height = box.offsetHeight;
        if (rect.top < e.clientY && e.clientY < rect.top+height && rect.left < e.clientX && e.clientX < rect.left+width) {
            console.log();
        } else {
            document.getElementById(props.file).style.display = 'none';
        }
    }

    const showInfo = (where) => {
        document.getElementById(where).style.display = "flex";
    }

    return (
        <div className='file-container'>
            <button className="file" onClick={() => {getData(`${props.path.replace(".",'/')}/${props.file}`);showInfo(props.file)}}>
                {props.file}
            </button>
            <div className='file-popup' id={props.file} onClick={(e) => toggle(e)}>
                <div id={`${props.file}1`}>
                    <p>Owner: {props.owner}</p>
                    <p>Path: {`${props.path.replace(".",'/')}/${props.file}`}</p>
                    <p>Content-type: {getType(props.file.split(".").reverse()[0])}</p>
                    <button>Download</button>
                </div>
            </div>
        </div>
    );
}

export default File;