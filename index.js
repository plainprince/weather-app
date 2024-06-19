const express = require('express');
const nodeWebcam = require('node-webcam');
const prompt = require('prompt');
const { createServer } = require('node:http');
const { Server } = require('socket.io');
const fs = require('fs');
const schedule = require('node-schedule');
require('dotenv').config()

const app = express();
const server = createServer(app);
const io = new Server(server);

let data = [];
let currentData = {
    temperature: 0,              // add sensor values
    light: 0,                    // add sensor values
    humidity: 0,                 // add sensor values
    winddirection: 'something',  // add sensor values
    windspeed: 0,                // add sensor values
    precipitation: 0             // add sensor values
};
fs.readFile('db.json', (err, fileData) => {
    if(err) throw err;
    data = JSON.parse(fileData);
    //console.log(data);
});

var opts = {
    width: 1280,
    height: 720,
    quality: 100,
    frames: 60,
    delay: 0,
    saveShots: true,
    output: "jpeg",
    device: false,
    callbackReturn: "location",
    verbose: false
};

var webcam = nodeWebcam.create(opts);
var length;
var webcams = [];
webcam.list(list => {
    list.forEach((i, index) => {
        console.log(index, i);
        length = index;
        webcams.push(i);
    });
});

prompt.start();
prompt.get(['camera'], (err, result) => {
    if(result.camera == parseInt(result.camera) && parseInt(result.camera) <= length) {
        opts.device = webcams[parseInt(result.camera)].substring(3, webcams[parseInt(result.camera)].length);
        webcam = nodeWebcam.create(opts);
        console.log('using webcam', opts.device)
    }else {
        console.log('invalid input:', result)
        return
    }
    if(err) throw err
    server.listen(process.env.PORT || 80, () => {
        console.log(`server listening on port ${process.env.PORT || 80}`);
    });
    setInterval(() => {
        webcam.capture('public/cam');
    }, 5000);
});

webcam.capture('test-picture');

app.use(express.static('public'));
app.use(express.json())

io.on('connection', (socket) => {
    socket.on('getData', () => {
        io.to(socket.id).emit('data', {data, currentData});
    });
});

app.post('/setData', (req, res) => {
    const { pwd } = req.body
    if (pwd === process.env.PASSWORD) {
        const { readData } = req.body
        const { addToDB } = req.body
        if(addToDB) {
            data.push(readData);
            fs.writeFile('db.json', JSON.stringify(data), { encoding: 'utf8' }, () => {
                console.log('data saved');
            });
        }else {
            currentData = readData;
        }
        res.json({info: "uploaded successfully"})
    }else {
        res.json({info: "wrong password, better not try hacking us"})
        console.log('somebody is trying to hack us (probably)')
    }
})