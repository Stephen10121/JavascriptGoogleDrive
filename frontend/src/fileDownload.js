const axios = require("axios");

const downloadFile = async (id, which) => {
    console.log(id);
    console.log(which);
    const data = await axios.get(
        '/download',
        { params: {
            id: id,
            location: which
        }
    });
    if (data.status === 200) {
        return data;
    } else {
        return "error";
    }
}

module.exports = {downloadFile}