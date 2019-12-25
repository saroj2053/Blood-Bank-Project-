var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");


var DonorSchema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    email_address: String,
    date_of_birth: Date,
    gender: String,
    blood_group: String,
    donor_address: String,
    donor_city: String,
    contact_number: Number
});

module.exports = mongoose.model("Donor",DonorSchema);