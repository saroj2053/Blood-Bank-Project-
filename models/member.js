var mongoose = require("mongoose");

var memberSchema = new mongoose.Schema({
    name: String,
    email: String,
    dob: String,
    gender: String,
    bloodGroup: String,
    address: String,
    city: String,
    phone: Number
});

module.exports = mongoose.model("Member",memberSchema);