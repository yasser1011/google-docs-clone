const mongoose = require("mongoose");

const documentSchema = mongoose.Schema({
  _id: { type: String },
  data: { type: Object },
});

module.exports = mongoose.model("documents", documentSchema);
