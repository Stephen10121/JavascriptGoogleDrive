const axios = require("axios");

const shareFolderPost = async (key, whom, location, folder) => {
    const data = await axios({
        method: 'post',
        url: '/shareFolder',
        data: {
            id: key,
            whom,
            location,
            folder
        }
    });
    if (data.status === 200) {
        return data;
    } else {
        return "error";
    }
}

export default shareFolderPost;