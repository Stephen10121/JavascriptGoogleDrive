const axios = require("axios");

const files = async (key) => {
    const data = await axios({
        method: 'post',
        url: 'https://drive.gruzservices.com/getFiles',
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