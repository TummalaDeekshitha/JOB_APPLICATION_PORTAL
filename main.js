const bcrypt = require('bcrypt');
const express = require("express");
const path = require("path");
const app = express();
app.use(express.static(path.join(__dirname, "public")));
const http = require('http');
const { Server } = require('socket.io');
const server = http.createServer(app);
const io = new Server(server);
const session = require("express-session");
const otpGenerator = require('otp-generator');
const multer = require("multer");
const nodemailer = require("nodemailer");
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

const mongoose = require("mongoose");
const { error } = require("console");
const grid = require('gridfs-stream');
app.use(express.urlencoded({ extended: false, limit: '50mb' }));

const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
app.use(cookieParser());
app.use(express.json({ limit: '50mb' }));

var connectDB = require("./mangoosefile.js");
const { stringify } = require('querystring');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const { uploadfile, getfilestream } = require('./s3');
connectDB();
var indexrouter = require('./routes/index.js');

var employerrouter = require('./routes/employer.js');
var employerlogin = require('./routes/employerlogin.js');
var admin = require("./routes/admin.js");
const { employerprotect } = require('./middleware/employerprotect.js');

app.use('/', indexrouter);
app.use('/employer', employerrouter);
app.use('/employerlogin', employerlogin);
app.use("/admin", admin);

app.get('/images/:key', (req, res) => {
    const key = req.params.key;
    const readstream = getfilestream(key);
    readstream.pipe(res);
});
app.get('/socket.io/socket.io.js', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'node_modules', 'socket.io', 'client-dist', 'socket.io.js'), {
        headers: {
            'Content-Type': 'application/javascript'
        }
    });
});

const users = {};

io.on("connection", (socket) => {
    socket.on('new-user-joined', (username) => {
        console.log(username);
        users[socket.id] = username;
        socket.broadcast.emit('user-joined', username);
    });

    socket.on('send', (message) => {
        socket.broadcast.emit('receive', { message: message, username: users[socket.id] });
    });

    socket.on('disconnect', () => {
        socket.broadcast.emit('left', users[socket.id]);
        delete users[socket.id];
    });
});

const start = async () => {
    try {
        server.listen(6557, () => {
            console.log("Server is running on port 6556");
        });
    } catch (error) {
        console.log(error);
    }
}

start();
