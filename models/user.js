const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    fullname: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    created: { type: Date, required: true, default: Date.now },
    roles: [{
        type: String,
        enum: ['admin', 'user', 'editor', 'moderator'], // Define your roles here
      }],
});

module.exports = mongoose.model("User", userSchema);