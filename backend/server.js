const http = require("http");
const express = require('express');
const socketio = require('socket.io');
const { userLogin, getUserData, signup } = require("./database");
const { getFiles } = require("./data");
const { PassThrough } = require("stream");
const { hashed } = require("./functions");
const PORT = 4000;
const app = express();

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    next();
});

app.set('view engine', 'ejs');
app.use( express.json(), express.static('public'), express.urlencoded({ extended: true }));

const server = http.createServer(app);
const io = socketio(server, {
  cors: {
      origin: '*',
      methods: ['GET', 'POST']
  }
});
const theUsernames = {}
app.get('/', (req, res) => res.render('index'));

app.post('/login', async (req, res) => {
    if (req.body.username && req.body.password) {
        const user = await userLogin(req.body.username, req.body.password);
        if (user.error == 200) {
            delete user.data.userInfo.password;
            theUsernames[user.data.key] = req.body.username;
        }
        const files = await getFiles(`./storage/${hashed(req.body.username)}`);
        const newFiles = [];
        for (i in files) {
            newFiles.push(files[i].replace(`./storage/${hashed(req.body.username)}`,'home'));
        }
        user.data.userInfo['files'] = newFiles;
        res.status(200).send({error: user.error, key: user});
    } else {
        res.status(400).send("Missing Fields");
    }
});

app.post('/signup', async (req, res) => {
    if (req.body.name && req.body.email && req.body.username && req.body.password && req.body.rpassword) {
        if (req.body.password === req.body.rpassword) {
            const user = await signup(req.body.username, req.body.password, req.body.email, req.body.name);
            if (user.error == 200) {
                theUsernames[user.data.key] = req.body.username;
            }
            const files = await getFiles(`./storage/${hashed(req.body.username)}`);
            const newFiles = [];
            for (i in files) {
                newFiles.push(files[i].replace(`./storage/${hashed(req.body.username)}`,'home'));
            }
            user.data.userInfo['files'] = newFiles;
            res.status(200).send({error: user.error, key: user});
        } else {
            res.status(200).send({error: 444, key: {errorMessage: "Passwords Dont Match."}})
        }
    } else {
        res.status(400).send("Missing Fields");
    }
});

app.post('/userinfo', async (req, res) => {
    if (req.body.id) {
        if (theUsernames[req.body.id]) {
            const userinfo = await getUserData(theUsernames[req.body.id]);
            delete userinfo.password;
            res.status(200).send({error: 200, user: userinfo});
        } else {
            res.status(200).send({error: 1010, errorMessage: "invalid id"});
        }
    } else {
        res.status(400).send("Missing Fields");
    }
});

app.post('/getFiles', async (req, res) => {
    if (req.body.id) {
        if (theUsernames[req.body.id]) {
            const files = await getFiles(`./storage/${hashed(theUsernames[req.body.id])}`);
            const newFiles = [];
            for (i in files) {
                newFiles.push(files[i].replace(`./storage/${hashed(theUsernames[req.body.id])}`,''));
            }
            res.status(200).send({error: 200, data: newFiles});
        } else {
            res.status(200).send({error: 1010, errorMessage: "invalid id"});
        }
    } else {
        res.status(400).send("Missing Fields");
    }
});

app.post("/logout", (req, res) => {
    if (req.body.id) {
        if (theUsernames[req.body.id]) {
            delete theUsernames[req.body.id];
            res.status(200).send({error: 200, errorMessage: "all-good"});
        } else {
            res.status(200).send({error: 1010, errorMessage: "invalid id"});
        }
    } else {
        res.status(400).send("Missing Fields");
    }
});

const whiteList = [];

io.on('connection', socket => {
    socket.on("auth", (data) => {
        if (data == "password") {
            whiteList.push(socket.id);
        } else {
            socket.disconnect();
        }
    });

    socket.on("test", (data) => {
        if (whiteList.includes(socket.id)) {
            console.log(data);
        } else {
            socket.disconnect();
        }
    });
});

server.listen(PORT, () => console.log(`Server running on port ${PORT}.`));