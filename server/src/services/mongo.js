const mongoose = require("mongoose"); // gives the object modeling features

// access the environmental variables
require("dotenv").config();

const MONGO_URL = process.env.MONGO_URL;

// check the connection
mongoose.connection.once("open", () => {
  // the callback will be executed once on start
  console.log("MongoDB connection ready!");
});

// check for errors
mongoose.connection.on("error", (err) => {
  console.error(`====== MongoDB connection error:\n${err} =========`);
});

async function mongoConnect() {
  // connect to the mongoDB
  await mongoose.connect(MONGO_URL);
}

// a function to disconnect from the mongoDB
async function mongoDisconnect() {
  await mongoose.disconnect();
}

module.exports = {
  mongoConnect,
  mongoDisconnect,
};
