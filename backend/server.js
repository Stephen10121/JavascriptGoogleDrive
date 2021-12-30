const http = require("http");
const express = require('express');
const socketio = require('socket.io');
const { userLogin, getUserData } = require("./database");
const { userInfo } = require("os");
const { PassThrough } = require("stream");
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
        delete user.data.userInfo.password;
        theUsernames[user.data.key] = req.body.username;
        res.status(200).send({error: user.error, key: user});
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