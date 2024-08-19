const BASE_API_URL = "http://localhost:8000/v1"; // version /v1
async function httpGetPlanets() {
  // Load planets and return as JSON.
  // fetch the planets from API on port 8000
  const response = await fetch(`${BASE_API_URL}/planets`);
  // return the response as JSON
  return await response.json(); // await the Promise
}

async function httpGetLaunches() {
  // Load launches, sort by flight number, and return as JSON.
  // fetch the launches from API on port 8000
  const response = await fetch(`${BASE_API_URL}/launches`);
  // await the response as JSON
  const fetchedLaunches = await response.json(); // await the Promise
  // sort the launches by flight number
  return fetchedLaunches.sort((a, b) => {
    return a.flightNumber - b.flightNumber; // sorts in ascending order
  });
}

async function httpSubmitLaunch(launch) {
  // Submit given launch data to launch system.
  try {
    // await the response as JSON
    const response = await fetch(`${BASE_API_URL}/launches`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(launch), // convert the launch object body to json format
    });
    // return the response
    return response;
  } catch (err) {
    return {
      ok: false,
    };
  }
}

async function httpAbortLaunch(id) {
  // Delete launch with given ID.
  try {
    // await the response as JSON
    const response = await fetch(`${BASE_API_URL}/launches/${id}`, {
      method: "DELETE",
    });
    // return the response
    return response;
    // return the response as JSON
  } catch (err) {
    return {
      ok: false,
    };
  }
}

export { httpGetPlanets, httpGetLaunches, httpSubmitLaunch, httpAbortLaunch };
