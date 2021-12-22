const http = require("http");
const express = require('express');
const socketio = require('socket.io');
const { createHash } = require("./functions");
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

app.get('/', (req, res) => res.render('index'));

app.post('/login', (req, res) => {
    if (req.body.username && req.body.password) {
        console.log(req.body);
        res.status(200).send({error: "none", key: createHash()});
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