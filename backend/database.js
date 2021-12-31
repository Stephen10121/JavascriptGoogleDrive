const fs = require("fs");
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

function addData(data) {
    return new Promise((resolve, reject) => {
        fs.writeFile('./users.json', data, async (err) => {
            if (err) {
                console.log(err);
                resolve(false);
            } else {
                resolve(true);
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

async function signup(username, userPassword, userEmail, name) {
    const users = await getUsers();
    if (users.includes(username)) {
        return({error: 1005, errorMessage: "Username Taken"});
    }
    const data = await getData();
    data.users[username] = {
        rname: name,
        email: userEmail,
        password: hashed(userPassword)
    }
    const sentData = await addData(JSON.stringify(data));
    if (sentData) {
        var dir = `./storage/${hashed(username)}`;

        fs.mkdir(dir, { recursive: true }, (err) => {
            if (err) throw err;
        });
        return({error: 200, data: {userInfo: {rname: name, email: userEmail}, key: createHash()}});
    } else {
        return({error: 1006, errorMessage: "Error Saving Data 1006"});
    }
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
            return({error: 200, data: {userInfo: user, key: createHash()}});
        } else {
            return({error: 1001, errorMessage: "Invalid Password"});
        }
    } else {
        return({errorMessage: "Invalid Username", error: 1000});
    }
}

module.exports = {
    userLogin,
    getUserData,
    signup
}