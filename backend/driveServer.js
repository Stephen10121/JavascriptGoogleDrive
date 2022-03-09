const http = require("http");
const express = require('express');
const fileUpload = require('express-fileupload');
const socketio = require('socket.io');
const { userLogin, getUserData, signup } = require("./database2");
const { getFiles } = require("./data");
const { PassThrough } = require("stream");
const { hashed } = require("./functions");
const multer  = require('multer');
const fs = require('fs');
const PORT = 5400;
const app = express();
const upload = multer();
var type = upload.single('document');
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', "https://auth.gruzservices.com");
    res.setHeader('Access-Control-Allow-Headers', '*');
    next();
});

app.set('view engine', 'ejs');
app.use( fileUpload({
    limits: {
        fileSize: 10000000 //1mb
    },
}), express.json(), express.static('public'), express.urlencoded({ extended: true }));

const server = http.createServer(app);
const io = socketio(server, {
  cors: {
      origin: '*',
      methods: ['GET', 'POST']
  }
});
const theUsernames = {}
app.get('/', (req, res) => res.render('index'));
app.get('/signup', (req, res) => res.render('index'));
app.get('/login', (req, res) => res.render('index'));
app.get('/logout', (req, res) => res.render('index'));
app.get('/profile', (req, res) => res.render('index'));

app.get('/download', (req, res) => {
    if (req.query.id && req.query.location) {
        if (theUsernames[req.query.id]) {
            console.log(`Id: ${req.query.id}. Location: ${req.query.location}.`);
            const file = `${__dirname}/storage/${hashed(theUsernames[req.query.id])}${req.query.location.slice(4)}`;
            console.log(file);
            fs.access(file, fs.F_OK, (err) => {
                if (err) {
                  console.error(err);
                  return res.status(200).send("Folder doesn't exist.");
                }
                return res.download(file);
            });
        } else {
            return res.status(200).send("Invalid id");
        }
    } else {
        return res.status(200).send("Missing parameters.");
    }
});

app.post('/auth', async (req, res) => {
    console.log(req.body);
    const newData = req.body;
    const result = await userLogin({hash: newData.data, name: newData.name, email: newData.email});
    console.log(result);
    io.to(req.body.key).emit('auth', req.body.data);
});

app.post('/login', async (req, res) => {
    if (req.body.username && req.body.password) {
        const user = await userLogin(req.body.username, req.body.password);
        if (user.error == 200) {
            theUsernames[user.data.key] = req.body.username;
            const files = await getFiles(`./storage/${hashed(req.body.username)}`);
            const newFiles = [];
            for (i in files) {
                newFiles.push(files[i].replace(`./storage/${hashed(req.body.username)}`,'home'));
            }
            user.data.userInfo['files'] = newFiles;
        }
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

String.prototype.replaceAll = function(str1, str2, ignore) 
{
    return this.replace(new RegExp(str1.replace(/([\/\,\!\\\^\$\{\}\[\]\(\)\.\*\+\?\|\<\>\-\&])/g,"\\$&"),(ignore?"gi":"g")),(typeof(str2)=="string")?str2.replace(/\$/g,"$$$$"):str2);
}
var MyBlobBuilder = function() {
    this.parts = [];
  }
  
  MyBlobBuilder.prototype.append = function(part) {
    this.parts.push(part);
    this.blob = undefined; // Invalidate the blob
  };
  
  MyBlobBuilder.prototype.getBlob = function() {
    if (!this.blob) {
      this.blob = new Blob(this.parts, { type: "text/plain" });
    }
    return this.blob;
  };
  function blobToFile(theBlob, fileName){
    //A Blob() is almost a File() - it's just missing the two properties below which we will add
    theBlob.lastModifiedDate = new Date();
    theBlob.name = fileName;
    return theBlob;
}
  
let loadedFiles = {}
let reqnum = 0;
app.post('/uploadc', (req, res) => {
    reqnum++;
    console.log(`${reqnum} reqs made`);
    const fileData = JSON.parse(req.body.jsondataRequest);
    loadedFiles[fileData.sec] = req.files.document;
    if (Object.keys(loadedFiles).length == fileData.totalsecs) {
        var myBlobBuilder = new MyBlobBuilder();
        for (let i = 0; i < fileData.totalsecs; i++) {
            myBlobBuilder.append(loadedFiles[i]);
        }
        var bb = blobToFile(myBlobBuilder.getBlob(), "test.mp3");
        console.log(bb);
    }
    res.send(loadedFiles);
});

app.post('/upload', (req, res) => {
    if(req.files === null) {
        return res.status(400).json({ msg: 'No file uploaded' });
    }
    if (!req.body.jsondataRequest) {
        return res.status(400).json({ msg: 'Missing parameters' });
    }
    const data = JSON.parse(req.body.jsondataRequest);
    if(!data.id & !data.path) {
        return res.status(400).json({ msg: 'Missing parameters' });
    }
    const {id, path} = data;
    if (!theUsernames[id]) {
        return res.status(400).json({ msg: 'Invalid input' });
    }
    let path2 = path;
    path2 = path2.replaceAll(".", "/").replace('home', hashed(theUsernames[id]));
    const file = req.files.file;
    file.mv(`${__dirname}/storage/${path2}/${req.files.file.name}`, (err) => {
        if(err) {
            console.error(err);
            return res.status(500).send(err);
        }

        res.json({ fileName: file.name, filePath: `test` });
    });
});

const whiteList = [];

io.on('connection', socket => {
    socket.on("auth", (data) => {
        // if (data == "password") {
        //     whiteList.push(socket.id);
        // } else {
        //     socket.disconnect();
        // }
    });

    socket.on("test", (data) => {
        console.log(data);
        // if (whiteList.includes(socket.id)) {
        //     //console.log(data);
        // } else {
        //     socket.disconnect();
        // }
    });
});

server.listen(PORT, () => console.log(`Server running on port ${PORT}.`));