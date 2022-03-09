const Database = require('sqlite-async');
const fs = require("fs");
const { hashed, createHash } = require("./functions");

async function createTable() {
    const db = await Database.open("./users.db");
    try {
        await db.run(`CREATE TABLE users (
            id INTEGER PRIMARY KEY,
            usersHash varchar(200) NOT NULL,
            usersRName varchar(200) NOT NULL,
            usersEmail varchar(200) NOT NULL,
            usersProfile varchar(200) NOT NULL
        )`);
    } catch (error) {
        console.error(error.message);
    } finally {
        await db.close();
        return 200;
    }
}

async function getUser(id) {
    const db = await Database.open("./users.db");
    let sql = "SELECT * FROM USERS WHERE id=?";
    const result = await db.all(sql, [id]);
    await db.close();
    return result;
}

async function getUserByHash(hash) {
    const db = await Database.open("./users.db");
    let sql = "SELECT * FROM USERS WHERE usersHash=?";
    const result = await db.all(sql, [hash]);
    await db.close();
    return result;
}

async function addUser(hash, rName, email, profile) {
    const db = await Database.open("./users.db");
    const insertStatement = "INSERT INTO users (usersHash, usersRName, usersEmail, usersProfile) VALUES (?, ?, ?, ?)";
    
    try {
        const result = db.run(insertStatement, [hash, rName, email, profile]);
        await db.close();
        return result;
    } catch (err) {
        console.error(err);
        return 'error';
    }
}

async function editUser(id, hash, rName, email, profile) {
    const db = await Database.open("./users.db");
    const updateStatement = "UPDATE users SET usersHash=?, usersRName=?, usersEmail=?, usersProfile=? WHERE id=?";
    try {
        const result = await db.run(updateStatement, [hash, rName, email, profile, id]);
        await db.close();
        return result;
    } catch (err) {
        console.error(err);
        return 'error';
    }
}

async function userLogin({ hash, name, email}) {
    const users = await getUserByHash(hash);
    if (users.length === 0) {
        const addedUser = await addUser(hash, name, email, JSON.stringify({}));
        if (addedUser === 'error') {
            return({errorMessage: "Error Try Again", error: 1000});
        }
        console.log(addedUser);
    }
    console.log(users);
    return({error: 200, data: {userInfo: users[0]}});
}

async function getUserData(user) {
    const users = await getUser(user);
    return users[0];
}

//createTable().then(data=>console.log(data));

module.exports = {
    userLogin,
    getUserData
}