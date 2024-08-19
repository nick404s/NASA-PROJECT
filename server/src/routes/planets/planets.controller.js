const { getAllPlanets } = require("../../models/planets.model");

// define the function to get all planets
async function httpGetAllPlanets(req, res) {
  return res.status(200).json(await getAllPlanets());
}

module.exports = {
  httpGetAllPlanets,
};
