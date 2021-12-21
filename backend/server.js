const http = require("http");
const express = require('express');
const socketio = require('socket.io');
const PORT = 4000;
const app = express();

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
    res.send("wow");
});

io.on('connection', socket => {
  socket.on("test", (data) => console.log(data));
});

server.listen(PORT, () => console.log(`Server running on port ${PORT}.`));