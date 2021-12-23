const fs = require("fs");
const { resolve } = require("path");
const { receiveMessageOnPort } = require("worker_threads");
const { hashed, createHash } = require("./functions");

function getData() {
    return new Promise((resolve, reject) => {
        fs.readFile('./users.json', 'utf-8', async (err, jsonString) => {
            if (err) {
                console.log(err);
            } else {
                try {
                    const data = JSON.parse(jsonString);
                    resolve(data);
                } catch (err) {
                    console.log(err);
                }
            }
        });
    });
}

async function getUsers() {
    const user = [];
    const data = await getData();
    for (i in data.users) {user.push(i);}
    return user;
}

async function getUserData(user) {
    const data = await getData();
    return data.users[user];
}

async function userLogin(username, password) {
    const users = await getUsers();
    if (users.includes(username)) {
        const user = await getUserData(username);
        if (user.password == hashed(password)) {
            return({error: 200, data: {userInfo: user, key: createHash()}})
        } else {
            return({error: 1001, errorMessage: "Invalid Password"});
        }
    } else {
        return({errorMessage: "Invalid Username", error: 1000});
    }
}

module.exports = {
    userLogin
}