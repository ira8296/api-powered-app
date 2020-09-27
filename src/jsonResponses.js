const userKey = 'users';

if(typeof localStorage === "undefined" || localStorage === null){
    var LocalStorage = require('node-localstorage').LocalStorage;
    localStorage = new LocalStorage('./scratch');
}

const storedUsers = localStorage.getItem(userKey);

let users = {};

if (storedUsers) {
  users = storedUsers;
}

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

  if (!params.realName || !params.heroName || !params.age || !params.power1 || !params.power2) {
    const responseJSON = {
      id: 'missingParams',
      message: 'Names, age, and/or powers are required',
    };
    return respondJSON(request, response, 400, responseJSON);
  }
  if (users[params.realName]) {
    users[params.realName] = {};
    users[params.realName].realName = params.realName;
    users[params.realName].heroName = params.heroName;
    users[params.realName].age = params.age;
    users[params.realName].power1 = params.power1;
    users[params.realName].power2 = params.power2;
    if (params.image) {
      users[params.realName].image = params.image;
    }
    responseCode = 204;
  } else {
    newUser.realName = params.realName;
    newUser.heroName = params.heroName;
    newUser.age = params.age;
    newUser.power1 = params.power1;
    newUser.power2 = params.power2;
    if (params.image) {
      newUser.image = params.image;
    }
    newUser.message = 'Created successfully';
    users[params.name] = newUser;
  }
  localStorage.setItem(userKey, users);
  return respondJSON(request, response, responseCode, newUser);
};

const getUsers = (request, response) => {
  const responseJSON = users;

  return respondJSON(request, response, 200, responseJSON);
};

const getUsersMeta = (request, response) => respondJSONMeta(request, response, 200);

const search = (request, response, input) => {
  let responseCode = 200;
  const results = {};
  const user = Object.keys(users);

  for (let i = 0; i < user.length; i++) {
    const u = user[i];
    const values = Object.values(users[u]);
    for (let n = 0; n < values.length; n++) {
      const v = values[n];
      if (v === input) {
        results[u] = users[u];
      }
    }
  }

  if (results === {}) {
    responseCode = 404;
  }
  return respondJSON(request, response, responseCode, results);
};

const notReal = (request, response) => {
  const responseJSON = {
    message: 'The data you are looking for does not exist',
    id: 'notFound',
  };
  respondJSON(request, response, 404, responseJSON);
};

const notRealMeta = (request, response) => {
  respondJSONMeta(request, response, 404);
};

const notFound = (request, response) => {
  const responseJSON = {
    message: 'The data you are looking for could not be found',
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
  search,
  notReal,
  notRealMeta,
  notFound,
  notFoundMeta,
};
