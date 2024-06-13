#!/bin/bash

echo "installing fswebcam"
sudo apt install fswebcam

echo "installling nvm"
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.5/install.sh | bash

echo "starting npm 10.2.4"
nvm install 10.2.4
nvm use 10.2.4

echo "installing npm packages"
npm install

echo "done installing..."
echo "you can now start the app using \"npm start\""
echo "to stop it afterwards, use ctrl + c"