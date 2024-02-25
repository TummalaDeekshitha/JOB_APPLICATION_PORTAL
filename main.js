const express = require("express");
const path = require("path");
const app = express();
app.use(express.static(path.join(__dirname, "public")));
const http = require('http');
const { Server } = require('socket.io');
const server = http.createServer(app);
const io = new Server(server);
// const multer = require("multer");
require('dotenv').config();
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
const mongoose = require("mongoose");
// const { stringify } = require('querystring');
app.use(express.urlencoded({ extended: false, limit: '50mb' }));
const cookieParser = require("cookie-parser");
app.use(cookieParser());
app.use(express.json({ limit: '50mb' }));
var {connectDB}= require("./mangoosefile.js");

const {protect}=require("./middleware/protect");
const { uploadfile, getfilestream } = require('./s3');
connectDB();
var indexrouter = require('./routes/index.js');

var employerrouter = require('./routes/employer.js');
var employerlogin = require('./routes/employerlogin.js');
var admin = require("./routes/admin.js");

app.use('/', indexrouter);
app.use('/employer', employerrouter);
app.use('/employerlogin', employerlogin);
app.use("/admin", admin);


const {chatgpt}=require("./gpt.js");


app.get('/images/:key', (req, res) => {
    const key = req.params.key;
    const readstream = getfilestream(key);
    readstream.pipe(res);
});
/*app.get('/socket.io/socket.io.js', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'node_modules', 'socket.io', 'client-dist', 'socket.io.js'), {
        headers: {
            'Content-Type': 'application/javascript'
        }
    });
});
*/
const users = {};
app.get("/mybot",protect, (req, res) => {
    res.render("cg.ejs", { user: req.myusername,email:req.myemail });
    
})
io.on("connection", (socket) => {
    const setUser = (email) => {
        users[email] = socket.id;
    };

    // Function to emit a message to a specific user
    const sendMessageToUser = (email, gptmsg) => {
        const userSocket = users[email];
        if (userSocket) {
            io.to(userSocket).emit('gptmessage', {  message: gptmsg });
        }
    };
    socket.on('new-user-joined', (username) => {
        console.log(username);
        users[socket.id] = username;
        socket.broadcast.emit('user-joined', username);
    });

    socket.on('send', (message) => {
        socket.broadcast.emit('receive', { message: message, username: users[socket.id] });
    });

   
    socket.on("chatgptconnect",async(data)=>{//connect to mybot on entering the name
        username=data.username;
        email=data.email;
        console.log(username);
        console.log(email);
        gptmsg=await chatgpt(`greet to ${data.username}`);
        setUser(email);
        sendMessageToUser(email, gptmsg);
        console.log(users[email]);
        console.log(gptmsg);
        // socket.emit(`${username}`,msg);
        console.log("chatgptconnectdone");

    })
    socket.on("chatgptquery",async(query)=>{//user sends the  query or ask question on clicking on send button this will emit
        querymessage=query.message;
        gptmsg=await chatgpt(querymessage);
        sendMessageToUser(query.email, gptmsg);//sending the message to specific userwho connected
        console.log(gptmsg);
         console.log("im working")
    })
    socket.on("gptuserleft",(email)=>
    {
        delete users[email];
    });
  
    socket.on('disconnect', () => {
    socket.broadcast.emit('left', users[socket.id]);
    delete users[socket.id];
});
})
const start = async () => {
    try {
        server.listen(6559, () => {
            console.log("Server is running on port 6556");
        });
    } catch (error) {
        console.log(error);
    }
}

start();
