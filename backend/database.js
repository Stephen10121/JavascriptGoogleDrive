const fs = require("fs");
const { resolve } = require("path");

function getData() {
    return new Promise((resolve, reject) => {
        fs.readFile('./users.json', 'utf-8', (err, jsonString) => {
            if (err) {
                console.log(err);
            } else {
                try {
                    const data = JSON.parse(jsonString);
                    const one = "jeff";
                    resolve(data);
                } catch (err) {
                    console.log(err);
                }
            }
        });
    });
}

async function getData2() {
    const data = await getData();
    return data;
}

module.exports = {
    getData2
}