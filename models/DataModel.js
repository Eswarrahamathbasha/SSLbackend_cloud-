const mongoose = require("mongoose");

const DataSchema = new mongoose.Schema({
    name: String,
    email: String,
    message: String
});

module.exports = mongoose.model("Data", DataSchema);
