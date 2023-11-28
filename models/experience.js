const mongoose = require("mongoose");

const experienceSchema = new mongoose.Schema({
    position: { type: String, required: [true, 'Position is required.'] },
    employeer: { type: String, required: [true, 'Employeer is required.'] },
    address: { type: String, required: [true, 'Address is required.'] },
    description: { type: String, required: [true, 'Description is required.'] },
    from: { type: String, required: [true, 'Start date is required.'] },
    to: { type: String, required: [true, 'End date is required.'] },
});

module.exports = mongoose.model("Experience", experienceSchema);