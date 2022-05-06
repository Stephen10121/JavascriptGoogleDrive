const axios = require("axios");

const deleteFilePost = async (id2, which, file) => {
    const data = await axios({
        method: 'post',
        url: '/deleteFile',
        data: {
            id: id2,
            fileLocation: which,
            file: file
        }
    });
    if (data.status === 200) {
        return data;
    } else {
        return "error";
    }
}

export default deleteFilePost;