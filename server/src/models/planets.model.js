const fs = require("fs");
const path = require("path");
const { parse } = require("csv-parse");

const planets = require("./planets.mongo");

// const habitablePlanets = [];

const isHabitablePlanet = (planet) => {
  return (
    planet["koi_disposition"] === "CONFIRMED" &&
    planet["koi_insol"] > 0.36 && // lowest amount of light
    planet["koi_insol"] < 1.11 && // highest amount of light
    planet["koi_prad"] < 1.6 // radius
  );
};

// create a promise for the stream to wait the data being completely parsed
function loadPlanetsData() {
  return new Promise((resolve, reject) => {
    fs.createReadStream(
      path.join(__dirname, "..", "..", "data", "kepler_data.csv")
    )
      .pipe(
        parse({
          // parse the chunks of bytes to the readable planet objects
          comment: "#", // ignore comments in the csv file
          columns: true, //  map the columns to the keys of the object
        })
      )
      .on("data", async (planet) => {
        if (isHabitablePlanet(planet)) {
          // habitablePlanets.push(planet);
          savePlanet(planet);
        }
      })
      .on("error", (err) => {
        console.log(err);
        reject(err); // reject in case of error
      })
      .on("end", async () => {
        const planetCount = (await getAllPlanets()).length;
        console.log(`number of habitable planets: ${planetCount}`);
        console.log("done");
        resolve(); // just resolve without passing any data, just to populate the planets array
      });
  });
}

// A function that returns the planets array
async function getAllPlanets() {
  // use mongo's find operation
  // pass the empty {} object as first parameter to get all planets
  // exclude the mongo's id and version in the second parameter
  return await planets.find(
    {},
    {
      _id: 0,
      __v: 0,
    }
  );
}

async function savePlanet(planet) {
  // populate the mongo database
  // according to the schema of the model
  // insert only if the planet doesn't exist
  // insert + update = upsert in mongo
  try {
    await planets.updateOne(
      {
        keplerName: planet.kepler_name, // kepler_name is the column name in the csv file
      },
      {
        keplerName: planet.kepler_name,
      },
      {
        upsert: true, // insert
      }
    );
  } catch (err) {
    console.error(`======= Could not save planet:\n ${err}`);
  }
}

module.exports = {
  loadPlanetsData,
  getAllPlanets,
};
