const express = require('express');
const nodeWebcam = require('node-webcam');
const prompt = require('prompt');
const { createServer } = require('node:http');
const { Server } = require('socket.io');
const fs = require('fs');
const schedule = require('node-schedule');

const app = express();
const server = createServer(app);
const io = new Server(server);

const data = [];
let currentData = {
    temperature: 0,              // add sensor values
    light: 0,                    // add sensor values
    humidity: 0,                 // add sensor values
    winddirection: 'something',  // add sensor values
    windspeed: 0,                // add sensor values
    precipitation: 0             // add sensor values
};
fs.readFile('db.json', (err, data) => {
    if(err) throw err;
    data = JSON.parse(data).data;
    console.log(data);
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
    if(result === parseInt(result) && result <= length) {
        opts.device = webcams[parseInt(result)];
        webcam = nodeWebcam.create(opts);
    }
    server.listen(process.env.PORT || 80, () => {
        console.log(`server listening on port ${process.env.PORT || 80}`);
    });
    setInterval(() => {
        webcam.capture('public/cam');
        currentData = {
            temperature: 0,              // add sensor values
            light: 0,                    // add sensor values
            humidity: 0,                 // add sensor values
            winddirection: 'something',  // add sensor values
            windspeed: 0,                // add sensor values
            precipitation: 0             // add sensor values
        };
    }, 5000);
});

webcam.capture('test-picture');

app.use(express.static('public'));

io.on('connection', (socket) => {
    socket.on('getData', () => {
        io.to(socket.id).emit('data', {data, currentData});
    });
});

schedule.scheduleJob('0 0 * * *', () => { 
    const date = new Date().getFullYear() + '-' + new Date().getMonth() + '-' + new Date().getDate();
    data.push({
        date,
        temperature: 0,              // add sensor values
        light: 0,                    // add sensor values
        humidity: 0,                 // add sensor values
        winddirection: 'something',  // add sensor values
        windspeed: 0,                // add sensor values
        precipitation: 0             // add sensor values
    });
    fs.writeFile('db.json', JSON.stringify(data), { encoding: 'utf8' }, () => {
        console.log('data saved');
    });
});