// The keyword used to save and load users
const userKey = 'hero';

// Pulling in the NeDB database
const Datastore = require('nedb');

// Instance of the database
const database = new Datastore('./database.db');
// Initializing the database
database.loadDatabase();

// The object containing all of the users
const users = {};

// Loading all of the users and storing them within the users object
database.find({ occupation: userKey }, (err, docs) => {
  if (err) {
    console.dir(err);
  } else {
    for (let d = 0; d < docs.length; d++) {
      users[docs[d].realName] = docs[d];
    }
  }
});

// Sends back JSON object and status code depending on the type of process it's used for
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

// Same as respondJSON, but only sends back status code, no JSON object
const respondJSONMeta = (request, response, status) => {
  const headers = {
    'Content-Type': 'application/json',
  };
  // set status code and content type (application/json)
  response.writeHead(status, headers);
  // Send the response to the client
  response.end();
};

// Creates a new user to be placed inside the users object
const addUser = (request, response, params) => {
  // The status code which is sent at the end of the process
  let responseCode = 201;

  // Checks if the params object has the following parameters
  if (!params.realName || !params.heroName || !params.age || !params.power1 || !params.power2) {
    // Send JSON object with error message if not
    const responseJSON = {
      id: 'missingParams',
      message: 'Names, age, and/or powers are required',
    };
    return respondJSON(request, response, 400, responseJSON);
  } // Checks if the users object already has a user with the same key as params
  if (users[params.realName]) {
    responseCode = 204;
  } else {
    // A new index in the users object is created with an empty value
    // The realName property of the params object is used as the key
    users[params.realName] = {};
  }

  // Fills in  parameters for newly created user
  users[params.realName] = {};
  users[params.realName].occupation = userKey;
  users[params.realName].realName = params.realName;
  users[params.realName].heroName = params.heroName;
  users[params.realName].age = params.age;
  users[params.realName].power1 = params.power1;
  users[params.realName].power2 = params.power2;
  if (params.image) {
    users[params.realName].image = params.image;
  }

  // JSON object containing newly created user which is then sent back
  const responseData = {
    user: users[params.realName],
  };

  // Checks to see whether database should be updated
  // or new data inserted
  if (responseCode === 204) {
    database.update({ realName: params.realName }, users[params.realName], {});
  } else {
    database.insert(users[params.realName]);
  }

  // Sends back JSON object and response code
  return respondJSON(request, response, responseCode, responseData);
};

// Gets all of the listed users
const getUsers = (request, response) => {
  const responseJSON = users;

  return respondJSON(request, response, 200, responseJSON);
};

// Same as getUsers, but only sends the status code
const getUsersMeta = (request, response) => respondJSONMeta(request, response, 200);

// Sends back JSON object containing lists of super powers to be placed in the dropdown
const getPowers = (request, response) => {
  const primaryPowers = ['Superstrength',
    'Speed',
    'Durability',
    'Agility/reflexes',
    'Healing/regeneration',
    'Supersenses'];

  const secondaryPowers = ['Climbing/wall-crawling',
    'Swimming/water-breathing',
    'Flight',
    'Laser Vision',
    'X-Ray Vision',
    'Teleportation',
    'Exceptional leaping',
    'Phasing/intangibility',
    'Temporal manipulation',
    'Time travel',
    'Prophecy',
    'Fire',
    'Water',
    'Ice',
    'Earth',
    'Wind',
    'Electricity',
    'Light',
    'Darkness and/or shadows',
    'Gravity',
    'Magnetic forces',
    'Radiation',
    'Energy',
    'Sound',
    'Nature',
    'Psychic',
    'Acid/poison',
    'Controlling plants',
    'Controlling animals',
    'Shapeshifting (animals)',
    'Shapeshifting (people)',
    'Elasticity',
    'Self-destruction',
    'Self-liquification',
    'Gaseous form',
    'Growth',
    'Shrinking',
    'Self-duplication',
    'Invisibility',
    'Cybernetics',
    'Power Suit',
    'Weapon(s) Specialist',
    'Martial Arts',
    'Regeneration',
    'Absorbing someone else’s powers',
    'Negating someone else’s powers',
    'Luck manipulation',
    'Illusions'];
  const powers = {
    support: primaryPowers,
    main: secondaryPowers,
  };
  return respondJSON(request, response, 200, powers);
};

// Returns an error message stating that the requested data doesn't exist
const notReal = (request, response) => {
  const responseJSON = {
    message: 'The data you are looking for does not exist',
    id: 'notFound',
  };
  respondJSON(request, response, 404, responseJSON);
};

// Same as notReal, but only sends the status code
const notRealMeta = (request, response) => {
  respondJSONMeta(request, response, 404);
};

// Returns an error message stating that the requested data could not be found
const notFound = (request, response) => {
  const responseJSON = {
    message: 'The data you are looking for could not be found',
    id: 'notFound',
  };
  respondJSON(request, response, 404, responseJSON);
};

// Same as notFound, but only sends the status code
const notFoundMeta = (request, response) => {
  respondJSONMeta(request, response, 404);
};

// Exports all of the functions in jsonResponses to be used by any instance of it
module.exports = {
  addUser,
  getUsers,
  getUsersMeta,
  notReal,
  notRealMeta,
  notFound,
  notFoundMeta,
  getPowers,
};
