const fs = require('fs'); // pull in the file system module

const index = fs.readFileSync(`${__dirname}/../client/client.html`);
const style = fs.readFileSync(`${__dirname}/../client/style.css`);
const php = fs.readFileSync(`${__dirname}/./index.php`);
const background = fs.readFileSync(`${__dirname}/../media/city.jpg`);

const getIndex = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/html' });
  response.write(index);
  response.end();
};

const getStyle = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/css' });
  response.write(style);
  response.end();
};

const getPHP = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'application/x-httpd-php' });
  response.write(php);
  response.end();
};

module.exports.getIndex = getIndex;
module.exports.getStyle = getStyle;
module.exports.getPHP = getPHP;
