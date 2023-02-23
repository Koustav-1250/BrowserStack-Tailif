// Will be using express to create the server instead of http create sever to avoid lots of codes

const express = require('express')
const app = express()
const config = require('./config.json')
const {FileWatcher} = require("./app.js")
const fs = require('fs');
const http = require('http').Server(app);
const io = require('socket.io')(http)
const path = require('path');


app.use(express.json())


const watcher  = new FileWatcher("./logs.txt")

watcher.init();



app.get("/",(req,res)=>{
    res.send("Server is connected");
})


app.get("/logs",(req,res)=>{


    var options = {
        root: path.join(__dirname)
    };
     

    // So we will be having multiple clients If we have a new connection then we can push the datastore in FileWatcher class which
    // always stores the last 10 lines of the logs.txt file
    // else we will send updated logs only. 
    res.sendFile("logs.txt",options );

})


io.on('connection',(socket)=>{
    console.log("Client connected at ", socket.id);
    watcher.on("process", function prcoess(data){
        socket.emit("update-logs",data);
    })
    let data = watcher.getDataStore();
    socket.emit("init",data);
})


setInterval(()=>{
    fs.writeFileSync("./logs.txt","Hello World!!\n")
},1000)




http.listen(config.port,()=>{
    console.log("Server started at port:", config.port);
})









