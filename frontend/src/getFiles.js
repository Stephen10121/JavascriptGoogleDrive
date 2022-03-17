const axios = require("axios");

const getFiles = async (key) => {
    const data = await axios({
        method: 'post',
        url: '/getFiles',
        data: {
            id: key
        }
    });
    if (data.status === 200) {
        return data;
    } else {
        return "error";
    }
}

export default getFiles;