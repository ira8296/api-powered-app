const fs = require('fs'); // pull in the file system module

// Instances of the html, css, and image files
const index = fs.readFileSync(`${__dirname}/../client/client.html`);
const style = fs.readFileSync(`${__dirname}/../client/style.css`);
const background = fs.readFileSync(`${__dirname}/../media/city.jpg`);

// Sends the html page back to the client
const getIndex = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/html' });
  response.write(index);
  response.end();
};

// Sends back the css rules which apply to the html
const getStyle = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/css' });
  response.write(style);
  response.end();
};

// Sends back the image utilized by the css
const getJPG = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'image/jpg' });
  response.write(background);
  response.end();
};

// Exports all of the functions in htmlResponses to be used by any instance of it
module.exports.getIndex = getIndex;
module.exports.getStyle = getStyle;
module.exports.getJPG = getJPG;
