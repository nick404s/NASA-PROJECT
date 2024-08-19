const express = require("express");

// Import the getAllLaunches function from the launches.controller module
const {
  httpGetAllLaunches,
  httpAddNewLaunch,
  httpAbortLaunch,
} = require("./launches.controller");

const launchesRouter = express.Router();

// GET
launchesRouter.get("/", httpGetAllLaunches);
// POST
launchesRouter.post("/", httpAddNewLaunch);
// DELETE
// use Expresses parameter syntax to pass an id of a launch
launchesRouter.delete("/:id", httpAbortLaunch);

module.exports = launchesRouter;
