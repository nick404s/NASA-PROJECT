const path = require("path");
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

// import the routers
const api = require("./routes/api");

// create the express app middleware
const app = express();
// add cross origin resource sharing (CORS) to the app
//  and specify the origin
app.use(
  cors({
    origin: "http://localhost:3000", // the react frontend address
  })
);
// add the morgan logger to the app, combined - Apache format
app.use(morgan("combined"));

app.use(express.json()); // use the json content-type

app.use(express.static(path.join(__dirname, "..", "public"))); // serve the public frontend files

// add the api router middleware. mount it on the version 1 path
app.use("/v1", api);

app.get("/*", (req, res) => {
  // "*" - is a wildcard to serve all different routes after "/"
  // send the index.html on "/" using expresses static files serving functionality
  res.sendFile(path.join(__dirname, "..", "public", "index.html"));
});
// export the app
module.exports = app;
