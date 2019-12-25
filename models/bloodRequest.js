var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");


var BloodRequestSchema = new mongoose.Schema({
    name: String,
    age: Number,
    location: String,
    phone: Number,
    bloodGroup: String

});

module.exports = mongoose.model("BloodRequest",BloodRequestSchema);