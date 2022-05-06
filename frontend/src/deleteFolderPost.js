const axios = require("axios");

const deleteFolderPost = async (key, folder) => {
    const data = await axios({
        method: 'post',
        url: '/deleteFolder',
        data: {
            id: key,
            folder
        }
    });
    if (data.status === 200) {
        return data;
    } else {
        return "error";
    }
}

export default deleteFolderPost;