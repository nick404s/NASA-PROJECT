const express = require("express");

const { httpGetAllPlanets } = require("./planets.controller");

// create a planets router
const planetsRouter = express.Router();

// get the planets from the router
planetsRouter.get("/", httpGetAllPlanets);

// export the planets router
module.exports = planetsRouter;
