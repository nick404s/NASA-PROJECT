const express = require("express");

// import the planets  router
const planetsRouter = require("./planets/planets.router");
// import the launches router
const launchesRouter = require("./launches/launches.router");

const api = express.Router();

api.use("/planets", planetsRouter); // use the planets router middleware
api.use("/launches", launchesRouter); // use the launches router middleware with the "/launches" path

module.exports = api;
