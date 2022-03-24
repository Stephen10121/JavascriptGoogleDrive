const axios = require("axios");

const newFolderPost = async (key, path, name) => {
    const data = await axios({
        method: 'post',
        url: '/newFolder',
        data: {
            id: key,
            path,
            name
        }
    });
    if (data.status === 200) {
        return data;
    } else {
        return "error";
    }
}

export default newFolderPost;