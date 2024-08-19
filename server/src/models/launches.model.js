//
// A model for the launches
//
const axios = require("axios");
const launchesDB = require("./launches.mongo");
const planetsDB = require("./planets.mongo");

const DEFAULT_FLIGHT_NUMBER = 100;

// example model object
// const launch = {
//   flightNumber: 100, // flight_number
//   mission: "Kepler exp", // name
//   rocket: "Apollo-L1", // rocket.name
//   launchDate: new Date("December 27, 2030"), // date_local
//   target: "Kepler-442 b", // not applicable
//   customers: ["ZTM", "NASA"], // payload.customers
//   upcoming: true, // upcoming
//   success: true, // success
// };

const SPACEX_API_URL = "https://api.spacexdata.com/v4/launches/query";

async function populateLaunchesData() {
  // fetch data from the SpaceX API
  const response = await axios.post(SPACEX_API_URL, {
    // the request body
    query: {}, // no query filter
    options: {
      pagination: false, // to get all data at once
      populate: [
        {
          path: "rocket",
          select: {
            name: 1,
          },
        },
        {
          path: "payloads",
          select: {
            customers: 1,
          },
        },
      ],
    },
  });

  // check if the response is ok
  if (response.status !== 200) {
    console.log("Problem loading launch data");
    throw new Error("Launch data download failed");
  }

  // get the data from the response
  const launchDocs = response.data.docs;
  for (const launchDoc of launchDocs) {
    // extract the customers from the payloads
    const payloads = launchDoc["payloads"];
    // turn the 2D array of payloads into a 1d array of customers
    const customers = payloads.flatMap((payload) => {
      return payload["customers"];
    });

    // an object to store the launch data
    const launch = {
      flightNumber: launchDoc["flight_number"],
      mission: launchDoc["name"],
      rocket: launchDoc["rocket"]["name"],
      launchDate: new Date(launchDoc["date_local"]),
      upcoming: launchDoc["upcoming"],
      success: launchDoc["success"],
      customers,
    };

    // populate db collection
    await saveLaunch(launch);
  }
}

async function loadLaunchesData() {
  console.log("Loading launches data");
  // check if a launch data already in db
  const firstLaunch = await findLaunch({
    flightNumber: 1,
    rocket: "Falcon 1",
    mission: "FalconSat",
  });

  if (firstLaunch) {
    console.log("Launch data already loaded");
    return;
  }
  // populate the launches data
  await populateLaunchesData();
}

// a function to find a launch in mongo db
async function findLaunch(filter) {
  return await launchesDB.findOne(filter);
}

// launches.set(launch.flightNumber, launch);

// checks for an existing launch
async function existsLaunchWithId(launchId) {
  // check the map with the all launches
  return await findLaunch({ flightNumber: launchId });
}

// a function to calculate the latest flight number
async function getLatestFlightNumber() {
  // get the latest flight number from the mongo db
  const latestLaunch = await launchesDB.findOne().sort("-flightNumber"); // - for descending order
  if (!latestLaunch) {
    return DEFAULT_FLIGHT_NUMBER; // if no launches found, start from the default
  }
  return latestLaunch.flightNumber;
}

// A function to get launches from mongo db
async function getAllLaunches(skip, limit) {
  return await launchesDB
    .find({}, { _id: 0, __v: 0 }) // ignore the mongo's id and version
    .sort({ flightNumber: 1 }) // sort by flight number by 1 ascending order
    .skip(skip) // skip the first n launches
    .limit(limit); // limit a number of launches for one page
}

// A function to save a new launch to mongo db
async function saveLaunch(launch) {
  // use findOneAndUpdate to return only the properties that were set here
  await launchesDB.findOneAndUpdate(
    {
      flightNumber: launch.flightNumber, // update if exists
    },
    launch,
    {
      // insert or update the launch
      upsert: true,
    }
  );
}

// add a new launch to the mongo db
async function scheduleNewLaunch(launch) {
  // check if the targeted planet exists in the planets db
  const planet = await planetsDB.findOne({ keplerName: launch.target });
  if (!planet) {
    throw new Error("No matching planet found");
  }
  // increment the last flight number to get a new one
  const newFlightNumber = (await getLatestFlightNumber()) + 1;
  const newLaunch = Object.assign(launch, {
    // assign the default values
    success: true,
    upcoming: true,
    customers: ["Zero to Mastery", "NASA"],
    flightNumber: newFlightNumber,
  });
  await saveLaunch(newLaunch);
}

// a function to mark a launch as aborted
async function abortLaunchById(launchId) {
  // update the launch object with the aborted properties
  const aborted = await launchesDB.updateOne(
    { flightNumber: launchId },
    { upcoming: false, success: false }
  );
  // const aborted = launches.get(launchId); // get the launch object
  // aborted.upcoming = false; // set the upcoming property to false
  // aborted.success = false; // set the success property to false
  return aborted.acknowledged === true && aborted.modifiedCount === 1; // return a result of the operation
}

module.exports = {
  loadLaunchesData,
  existsLaunchWithId,
  getAllLaunches,
  scheduleNewLaunch,
  abortLaunchById,
};
