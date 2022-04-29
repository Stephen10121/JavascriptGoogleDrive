const axios = require("axios");

const shareFilePost = async (key, whom, location, file) => {
    const data = await axios({
        method: 'post',
        url: '/shareFiles',
        data: {
            id: key,
            whom,
            location,
            file
        }
    });
    if (data.status === 200) {
        return data;
    } else {
        return "error";
    }
}

export default shareFilePost;