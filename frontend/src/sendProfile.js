const axios = require("axios");

const sendProfile = async (key, profileSettings) => {
    console.log(profileSettings);
    console.log(key)
    return;
    const data = await axios({
        method: 'post',
        url: '/saveProfile',
        data: {
            id: key,
            profileSettings
        }
    });
    if (data.status === 200) {
        return data;
    } else {
        return "error";
    }
}

module.exports = {
    sendProfile
}