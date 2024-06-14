# Weather app
## 1. Introduction
I have recently seen the weather app of the website of the goetheschule Ilmenau, but after opening the devTools, I found many bugs and potential bugs.

### 1.1 Bugs
- Camera file is being sent in binary format and some browsers don't support binary images without a file extension like .jpg or .png.
- Any data (including the live camera) is not being sent live.

### 1.2 Potential bugs
- Data is being sent in .txt files. This much overwriting could destroy any hard drive in only a few years.
- The data is not in a swiper, it's just in a scrollable container which is not in styled the best way.
- Every time a viewer gets any data, the connection will get opened and closed again, which could need a lot of power from the server.

## 2. Application
This application is written in node.js. It requires linux to run, if the server is not running on Linux, please contact me via [plainprince@trash-mail.com](mailto:plainprince@trash-mail.com).

### 2.1 Installation
To install all dependencies, please run the `install.sh` script using `sh ./install.sh`. These dependencies include:  
- npm (isntalled via nvm)
- node.js
- npm package requirements (`fswebcam`)
- npm packages (`express`, `node-schedule`, `node-webcam`, `prompt` and `socket.io`)

### 2.2 Starting the app
To start the app on localhost, run `npm start`. To start the app on a specific port, use the `PORT` environment variable like this: `PORT=<port> npm start`. Then you can select the camera you want to use using the numbers which will be logged. Then the server will automatically start, once it logs `server listening on port 80`.

### 2.3 Stopping the app
To stop the app, just press `CTRL` and `C`.

## 3. Information
- This app might still be edited. It should be updated on the github page.
- For any bugs, please reach out to me via [plainprince@trash-mail.com](mailto:plainprince@trash-mail.com).