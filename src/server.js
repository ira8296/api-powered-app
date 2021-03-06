const http = require('http'); // pull in the http server module
const url = require('url'); // pull in the url module
// pull in the query string module
const query = require('querystring');
// pull in our html response handler file
const htmlHandler = require('./htmlResponses.js');
// pull in our json response handler file
const jsonHandler = require('./jsonResponses.js');

// The port at which the program runs
const port = process.env.PORT || process.env.NODE_PORT || 3000;

// The logic which denotes what actions the server takes
// based on the specific request method and url path
const urlStruct = {
  GET: {
    '/': htmlHandler.getIndex,
    '/style.css': htmlHandler.getStyle,
    '/media/city.jpg': htmlHandler.getJPG,
    '/start': jsonHandler.getPowers,
    '/getUsers': jsonHandler.getUsers,
    '/notReal': jsonHandler.notReal,
    notFound: jsonHandler.notFound,
  },
  HEAD: {
    '/getUsers': jsonHandler.getUsersMeta,
    '/notReal': jsonHandler.notRealMeta,
    notFound: jsonHandler.notFoundMeta,
  },
};

// Handles POST requests
const handlePost = (request, response, parsedUrl) => {
  if (parsedUrl.pathname === '/addUser') {
    const params = [];

    request.on('error', (err) => {
      console.dir(err);
      response.statusCode = 400;
      response.end();
    });

    request.on('data', (chunk) => {
      params.push(chunk);
    });

    request.on('end', () => {
      const bodyString = Buffer.concat(params).toString();
      const bodyParams = query.parse(bodyString);

      jsonHandler.addUser(request, response, bodyParams);
    });
  }
};

// Logs out the request and decides what action to take,
// using the request and response as parameters
const onRequest = (request, response) => {
  console.log(request.url);
  const parsedUrl = url.parse(request.url);
  if (request.method === 'POST') {
    handlePost(request, response, parsedUrl);
  } else if (urlStruct[request.method][parsedUrl.pathname]) {
    urlStruct[request.method][parsedUrl.pathname](request, response);
  } else {
    urlStruct[request.method].notFound(request, response);
  }
};

// Initiates the server
http.createServer(onRequest).listen(port);

// Logs out where the server and/or program is running
console.log(`Listening on 127.0.0.1: ${port}`);
