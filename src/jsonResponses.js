const users = {};

const respondJSON = (request, response, status, object) => {
  const headers = {
    'Content-Type': 'application/json',
  };

  // set status code and content type (application/json)
  response.writeHead(status, headers);
  // stringify the object (so it doesn't use references/pointers/etc)
  // but is instead a flat string object.
  // Then write it to the response.
  response.write(JSON.stringify(object));
  // Send the response to the client
  response.end();
};

const respondJSONMeta = (request, response, status) => {
  const headers = {
    'Content-Type': 'application/json',
  };

  response.writeHead(status, headers);
  response.end();
};

const addUser = (request, response, params) => {
  const newUser = {};
    
  let responseCode = 201;

  if (!params.name || !params.age) {
    const responseJSON = {
      id: 'missingParams',
      message: 'Name and age are both required',
    };
    return respondJSON(request, response, 400, responseJSON);
  }
  else if (users[params.name]) {
    users[params.name] = {};
    users[params.name].name = params.name;
    users[params.name].age = params.age;
    // users[params.name] = newUser;
    responseCode = 204;
  }
  else {
   newUser.name = params.name;
   newUser.age = params.age;
   newUser.message = 'Created successfully';
   users[params.name] = newUser;   
  }
  return respondJSON(request, response, responseCode, newUser);
};

const getUsers = (request, response) => {
  const responseJSON = {
    users,
  };

  return respondJSON(request, response, 200, responseJSON);
};

const getUsersMeta = (request, response) => respondJSONMeta(request, response, 200);
const notReal = (request, response) => {
  const responseJSON = {
    message: 'The page you are looking for does not exist',
    id: 'notFound',
  };
  respondJSON(request, response, 404, responseJSON);
};

const notRealMeta = (request, response) => {
  respondJSONMeta(request, response, 404);
};

const notFound = (request, response) => {
  const responseJSON = {
    message: 'The page you are looking for could not be found',
    id: 'notFound',
  };
  respondJSON(request, response, 404, responseJSON);
};

const notFoundMeta = (request, response) => {
  respondJSONMeta(request, response, 404);
};

module.exports = {
  addUser,
  getUsers,
  getUsersMeta,
  notReal,
  notRealMeta,
  notFound,
  notFoundMeta,
};