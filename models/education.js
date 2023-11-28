const mongoose = require("mongoose");

const educationSchema = new mongoose.Schema({
    qualification: { type: String, required: true },
    department: { type: String, required: true },
    school: { type: String, required: true },
    address: { type: String, required: true },
    description: { type: String, required: true },
    from: { type: String, required: true },
    to: { type: String, required: true },
});

module.exports = mongoose.model("Education", educationSchema);