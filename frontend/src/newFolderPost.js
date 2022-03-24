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
        if (data.data.error) {
            if (data.data.error === 200) {
                return data.data.msg;
            }
            return data.data.msg;
        }
        if (data.data.msg) {
            return data.data.msg;
        } else {
            return "Success?";
        }
    } else {
        if (data.data.msg) {
            return data.data.msg;
        } else {
            return "An error Occured.";
        }
    }
}

export default newFolderPost;