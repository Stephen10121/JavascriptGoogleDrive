const Database = require('sqlite-async');
const fs = require("fs");
const { hashed, createHash } = require("./functions");

async function createTable() {
    const db = await Database.open("./users.db");
    try {
        await db.run(`CREATE TABLE users (
            id INTEGER PRIMARY KEY,
            usersName varchar(200) NOT NULL,
            usersRName varchar(200) NOT NULL,
            usersEmail varchar(200) NOT NULL,
            usersPassword varchar(300) NOT NULL,
            usersSharing varchar(10) NOT NULL,
            usersProfile varchar(200) NOT NULL,
            users2FA varchar(10) NOT NULL,
            users2FAPassword varchar(300)
        )`);
    } catch (error) {
        console.error(error.message);
    } finally {
        await db.close();
        return 200;
    }
}

async function getUser(user) {
    const db = await Database.open("./users.db");
    let sql = "SELECT * FROM USERS WHERE usersName=?";
    const result = await db.all(sql, [user]);
    await db.close();
    return result;
}

async function getAllUsers() {
    const db = await Database.open("./users.db");
    let sql = "SELECT * FROM USERS";
    const result = await db.all(sql, []);
    await db.close();
    return result;
}

async function getUserById(id) {
    const db = await Database.open("./users.db");
    let sql = "SELECT * FROM USERS WHERE id=?";
    const result = await db.all(sql, [id]);
    await db.close();
    return result;
}

async function addUser(name, rName, email, password, sharing, profile, twoFA, twoFAPassword) {
    const db = await Database.open("./users.db");
    const insertStatement = "INSERT INTO users (usersName, usersRName, usersEmail, usersPassword, usersSharing, usersProfile, users2FA, users2FAPassword) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
    
    try {
        const result = db.run(insertStatement, [name, rName, email, password, sharing, profile, twoFA, twoFAPassword]);
        await db.close();
        return result;
    } catch (err) {
        console.error(err);
        return 'error';
    }
}

async function editUser(id, name, rName, email, password, sharing, profile, twoFA, twoFAPassword) {
    const db = await Database.open("./users.db");
    const updateStatement = "UPDATE users SET usersName=?, usersRName=?, usersEmail=?, usersPassword=?, usersSharing=?, usersProfile=?, users2FA=?, users2FAPassword=? WHERE id=?";
    try {
        const result = await db.run(updateStatement, [name, rName, email, password, sharing, profile, twoFA, twoFAPassword, id]);
        await db.close();
        return result;
    } catch (err) {
        console.error(err);
        return 'error';
    }
}

async function signup(username, userPassword, userEmail, name) {
    const users = await getUser(username);
    if (users.length !== 0) {
        return({error: 1005, errorMessage: "Username Taken"});
    }
    const result = await addUser(username, name, userEmail, hashed(userPassword), "false", "profile1", "false", "");
    
    if (result === "error") {
        return({error: 1006, errorMessage: "Error Saving Data 1006"});
    } else {
        var dir = `./storage/${hashed(username)}`;

        fs.mkdir(dir, { recursive: true }, (err) => {
            if (err) throw err;
        });
        return({error: 200, data: {userInfo: {rname: name, email: userEmail, sharing: false, twoFA: false, profile: "profile1"}, key: createHash()}});
    }
}

async function userLogin(username, password) {
    const users = await getUser(username);
    if (users.length === 0) {
        return({errorMessage: "Invalid Username", error: 1000});
    }

    if (users[0].usersPassword !== hashed(password)) {
        return({error: 1001, errorMessage: "Invalid Password"});
    }
    delete users[0].id;
    delete users[0].usersPassword;
    delete users[0].users2FAPassword;
    return({error: 200, data: {userInfo: users[0], key: createHash()}});
}

async function getUserData(user) {
    const users = await getUser(user);
    return users[0];
}

//createTable().then(data=>console.log(data));

module.exports = {
    signup,
    userLogin,
    getUserData
}