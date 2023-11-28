const mongoose = require("mongoose");

const cvSchema = new mongoose.Schema({
    filePath: { type: String }
});

module.exports = mongoose.model("Cv", cvSchema);