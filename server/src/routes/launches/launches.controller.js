const {
  getAllLaunches,
  scheduleNewLaunch,
  existsLaunchWithId,
  abortLaunchById,
} = require("../../models/launches.model");

const { getPagination } = require("../../services/query");

// GET all launches
async function httpGetAllLaunches(req, res) {
  const { skip, limit } = getPagination(req.query);
  const launches = await getAllLaunches(skip, limit);
  return res.status(200).json(launches);
}

// POST a new launch
async function httpAddNewLaunch(req, res) {
  // populate the launch object from the request data
  const launch = req.body;

  if (
    !launch.mission ||
    !launch.rocket ||
    !launch.launchDate ||
    !launch.target
  ) {
    return res.status(400).json({
      error: "Missing required launch property",
    });
  }

  launch.launchDate = new Date(launch.launchDate);
  if (isNaN(launch.launchDate)) {
    return res.status(400).json({
      error: "Invalid launch date",
    });
  }

  await scheduleNewLaunch(launch);
  // sent back a 201 status(created) and the object that was created
  return res.status(201).json(launch);
}

// DELETE
async function httpAbortLaunch(req, res) {
  // get the id parameter from the url
  const launchId = Number(req.params.id);

  const isLaunchExists = await existsLaunchWithId(launchId);

  if (!isLaunchExists) {
    return res.status(404).json({ error: "Launch not found" });
  }

  // get the aborted launch
  const aborted = await abortLaunchById(launchId);

  // if the aborted is false, return an error
  if (!aborted) {
    return res.status(400).json({
      error: "Launch not aborted",
    });
  }

  return res.status(200).json({
    ok: true,
  });
}

module.exports = {
  httpGetAllLaunches,
  httpAddNewLaunch,
  httpAbortLaunch,
};
