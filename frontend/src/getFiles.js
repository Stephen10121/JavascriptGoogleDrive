const axios = require("axios");

const files = async (key) => {
    const data = await axios({
        method: 'post',
        url: 'http://192.168.0.24:4000/getFiles',
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

module.exports = {
    files
}