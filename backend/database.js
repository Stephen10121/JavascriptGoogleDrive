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

// getData2().then((data)=> console.log(data.users[0].name));

module.exports = {
    getData2
}

/*
const { createConnection } = require("mysql");


pool.connect((err) => {
    if (err) throw err;
    console.log(err);
});

pool.query("SELECT * FROM users;", (err, result, fields) => {
    if (err) {
        console.log(err);
    } else {
        console.log(result);
    }
});*/

/*
CREATE TABLE users (
    id int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
    user_name varchar(100) NOT NULL,
    user_rname varchar(100) NOT NULL,
    user_email varchar(100) NOT NULL,
    user_password varchar(300) NOT NULL
);

INSERT INTO users(user_name, user_rname, user_email, user_password) VALUES ("135407", "Stephen Gruzin", "135407@student.vansd.org", "testpassword");
SELECT * FROM users WHERE user_name = "135407";
*/