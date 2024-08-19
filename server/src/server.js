// the modules
const http = require("http");

// import the environmental variables
require("dotenv").config();

// import the app from the app.js file
const app = require("./app");

const { mongoConnect } = require("./services/mongo");

const { loadPlanetsData } = require("./models/planets.model");

const { loadLaunchesData } = require("./models/launches.model");

// define the server port through the environmental variable
// or use 8000 as the default port
const PORT = process.env.PORT || 8000;
// npm install --save-dev cross-env - a package for all OSes environments

// create the server and pass the express app
const server = http.createServer(app);

async function startServer() {
  // connect to the mongoDB
  await mongoConnect();

  // once the connection is established,
  // upload the planets data to the server
  await loadPlanetsData();
  // upload launches data
  await loadLaunchesData();

  // run the server loop
  server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}...`);
  });
}

startServer();
