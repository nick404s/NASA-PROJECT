const mongoose = require("mongoose");

const planetSchema = new mongoose.Schema({
  keplerName: {
    type: String,
    required: true,
  },
});

// connects planetSchema with the "planets" collection
// pass the schema to compile the model
module.exports = mongoose.model("Planet", planetSchema);
