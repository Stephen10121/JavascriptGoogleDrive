require('dotenv').config();
const http = require("http");
const express = require('express');
const fileUpload = require('express-fileupload');
const socketio = require('socket.io');
const { userLogin, getUserData, saveProfile, checkUserSharing } = require("./database2");
const { getFiles } = require("./data");
const { PassThrough } = require("stream");
const { hashed, copyRecursiveSync } = require("./functions");
const multer  = require('multer');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const PORT = 5500;
const app = express();
const upload = multer();
const path = require('path');
const illegalChars = ["#", "%", "&", "{", "}", "\\", "<", ">", "*", "?", "/", " ", "$", "!", "'", '"', ":", "@", "+", "`", "|", "="];

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
      methods: ['GET', 'POST'],
      allowEIO3: true
  }
});

const checkJWT = async (cookie) => {
    const jeff = await jwt.verify(cookie, process.env.ACCESS_TOKEN_SECRET, async (err, user) => {
        if (err) {
            return "clear";
        }
        const userif = await getUserData(user.usersHash);
        if (userif == "error") {
            return "clear";
        }
        return {msg: "good", data: user};
    }).then(data => {
        return(data);
    });
    return jeff;
}

app.get('/', (req, res) => {res.render('index');});
app.get('/signup', (req, res) => res.render('index'));
app.get('/login', (req, res) => res.render('index'));
app.get('/logout', (req, res) => res.render('index'));
app.get('/profile', (req, res) => res.render('index'));

app.get('/download', (req, res) => {
    if (!req.query.id || !req.query.location) {
        return res.status(400).json({msg: "Missing parameters."});
    }
    jwt.verify(req.query.id, process.env.ACCESS_TOKEN_SECRET, async (err, user) => {
        if (err) {
            return res.status(400).json({ msg: 'Invalid input' });
        }
        const userif = await getUserData(user.usersHash);
        if (userif == "error") {
            return res.status(400).json({ msg: 'Invalid input' });
        }
        console.log(`Id: ${req.query.id}. Location: ${req.query.location}.`);
        const file = `${__dirname}/storage/${hashed(user.usersName)}${req.query.location.slice(4)}`;
        console.log(file);
        fs.access(file, fs.F_OK, (err) => {
            if (err) {
                console.error(err);
                return res.status(200).send("Folder doesn't exist.");
            }
            return res.download(file);
        });
    });
});

app.post('/auth', async (req, res) => {
    const newData = req.body;
    console.log(req.body);
    const result = await userLogin({hash: newData.data, name: newData.name, email: newData.email, username: newData.username});
    if (result.error !== 200) {
        console.log(result.errorMessage);
        return res.json({ msg:"Something went wrong." });
    }
    delete result.data.userInfo.id;
    const accessToken = jwt.sign(result.data.userInfo, process.env.ACCESS_TOKEN_SECRET);
    io.to(req.body.key).emit('auth', {userData: result.data.userInfo, token: accessToken});
});

app.post('/userinfo', async (req, res) => {
    if (req.body.id) {
        if (checkJWT(req.body.id) === 'good') {
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
        const checker = await checkJWT(req.body.id);
        if (checker.msg === 'good') {
            const files = await getFiles(`./storage/${hashed(checker.data.usersName)}`);
            const newFiles = [];
            for (i in files) {
                newFiles.push(files[i].replace(`./storage/${hashed(checker.data.usersName)}/`,'home/'));
            }
            res.status(200).send({error: 200, data: newFiles});
        } else {
            res.status(200).send({error: 1010, errorMessage: "invalid id"});
        }
    } else {
        res.status(400).send("Missing Fields");
    }
});

app.post('/shareFiles', async (req, res) => {
    if (!req.body.id || !req.body.whom || !req.body.location || !req.body.file) {
        return res.json({msg: "Missing parameters."});
    }
    jwt.verify(req.body.id, process.env.ACCESS_TOKEN_SECRET, async (err, user) => {
        if (err) {
            return res.json({ msg: 'Invalid user' });
        }
        const userif = await getUserData(user.usersHash);
        if (userif == "error") {
            return res.json({ msg: 'Invalid user' });
        }
        const checkusersharingres = await checkUserSharing(req.body.whom);
        if (checkusersharingres === null) {
            return res.json({ msg: "User doesnt exist." });
        }
        if (checkusersharingres === "sfalse") {
            return res.json({ msg: "User disabled sharing." });
        }
        const sharingData = {
            whom: req.body.whom,
            location: req.body.location.replace("home", `./storage/${hashed(user.usersName)}`),
            saveLocation: `./storage/${hashed(req.body.whom)}/shared/${req.body.file}`,
            file: req.body.file
        }
        if (fs.existsSync(sharingData.saveLocation)) {
            return res.json({ msg: "File already exists." });
        }
        fs.copyFile(sharingData.location, sharingData.saveLocation, (err) => {
            if (err) {
                console.log("Error Found:", err);
                return res.json({ msg: "File share error" });
            }
            else {
                return res.json({ msg: "All good" });
            }
        });
    });
});

app.post('/shareFolder', async (req, res) => {
    if (!req.body.id || !req.body.whom || !req.body.location || !req.body.folder) {
        return res.json({msg: "Missing parameters."});
    }
    jwt.verify(req.body.id, process.env.ACCESS_TOKEN_SECRET, async (err, user) => {
        if (err) {
            return res.json({ msg: 'Invalid user' });
        }
        const userif = await getUserData(user.usersHash);
        if (userif == "error") {
            return res.json({ msg: 'Invalid user' });
        }
        const checkusersharingres = await checkUserSharing(req.body.whom);
        if (checkusersharingres === null) {
            return res.json({ msg: "User doesnt exist." });
        }
        if (checkusersharingres === "sfalse") {
            return res.json({ msg: "User disabled sharing." });
        }
        const sharingData = {
            whom: req.body.whom,
            location: req.body.location.replace("home", `./storage/${hashed(user.usersName)}`),
            saveLocation: `./storage/${hashed(req.body.whom)}/shared/${req.body.folder}`,
            folder: req.body.folder
        }
        if (fs.existsSync(sharingData.saveLocation)) {
            return res.json({ msg: "Folder already exists." });
        }
        copyRecursiveSync(sharingData.location, sharingData.saveLocation);
        res.json({ msg: "Success"});
        // fs.copyFile(sharingData.location, sharingData.saveLocation, (err) => {
        //     if (err) {
        //         console.log("Error Found:", err);
        //         return res.json({ msg: "File share error" });
        //     }
        //     else {
        //         return res.json({ msg: "All good" });
        //     }
        // });
    });
});



app.post("/logout", (req, res) => {
    res.status(200).send({error: 200, errorMessage: "all-good"});
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

app.post('/upload', async (req, res) => {
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
    jwt.verify(id, process.env.ACCESS_TOKEN_SECRET, async (err, user) => {
        if (err) {
            return res.status(400).json({ msg: 'Invalid input' });
        }
        const userif = await getUserData(user.usersHash);
        if (userif == "error") {
            return res.status(400).json({ msg: 'Invalid input' });
        }
        let path2 = path;
        path2 = path2.replaceAll(".", "/").replace('home', hashed(user.usersName));
        const file = req.files.file;
        file.mv(`${__dirname}/storage/${path2}/${req.files.file.name}`, (err) => {
            if(err) {
                console.error(err);
                return res.status(500).send(err);
            }

            res.json({ fileName: file.name, filePath: `test` });
        });
    });
});

app.post('/saveProfile', async (req, res) => {
    if (!req.body.id || !req.body.profileSettings) {
        return res.status(400).json({ msg: 'Missing parameters' });
    }
    const {id, profileSettings} = req.body;
    jwt.verify(id, process.env.ACCESS_TOKEN_SECRET, async (err, user) => {
        if (err) {
            return res.status(400).json({ msg: 'Invalid input' });
        }
        const userif = await getUserData(user.usersHash);
        if (userif == "error") {
            return res.status(400).json({ msg: 'Invalid input' });
        }
        if (await saveProfile(profileSettings, user.usersName) === "error") {
            res.status(400).json({msg: "Something went wrong when updating userdb with profile."});
        } else {
            res.json({msg: "good"});
        }
    });
});

app.post('/newFolder', async (req, res) => {
    if (!req.body.id || !req.body.path || !req.body.name) {
        return res.status(200).json({ error: 400, msg: 'Missing parameters' });
    }
    const {id, name} = req.body;
    jwt.verify(id, process.env.ACCESS_TOKEN_SECRET, async (err, user) => {
        if (err) {
            return res.status(200).json({ error: 400, msg: 'Invalid input' });
        }
        const userif = await getUserData(user.usersHash);
        if (userif == "error") {
            return res.status(200).json({ error: 400, msg: 'Invalid input' });
        }
        const result1 = illegalChars.some(illegalChar => name.includes(illegalChar));
        if (result1) {
            return res.status(200).json({ error: 400, msg: "Cannot include special chars." });
        }
        console.log(user);
        let path2 = path.join(__dirname, "storage", req.body.path.replace("home", hashed(user.usersName)).replaceAll(".", "/"), name);
        let errorpath = false;
        console.log(path2);
        fs.mkdir(path2, { recursive: true }, (err) => {
            if (err) {
                errorpath=true;
                throw err;
            }
        });
        const files = await getFiles(`./storage/${hashed(user.usersName)}`);
        const newFiles = [];
        for (i in files) {
            newFiles.push(files[i].replace(`./storage/${hashed(user.usersName)}/`,'home/'));
        }
        return res.status(200).json({ error: errorpath ? 500 : 200, msg: errorpath ? "Error Internal" : newFiles });
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
