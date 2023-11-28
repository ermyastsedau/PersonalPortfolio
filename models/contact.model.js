const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema({
    fullname: { type: String },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    message: { type: String, required: true },
});

module.exports = mongoose.model("Contact", contactSchema);