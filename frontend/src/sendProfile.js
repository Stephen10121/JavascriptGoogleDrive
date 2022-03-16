const axios = require("axios");

const sendProfile = async (key, profileSettings) => {
    //return;
    const data = await axios({
        method: 'post',
        url: '/saveProfile',
        data: {
            id: key,
            profileSettings
        }
    });
    if (data.status === 200) {
        return "good";
    } else {
        return "error";
    }
}

module.exports = {
    sendProfile
}