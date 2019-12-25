var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");


var EmployeeSchema = new mongoose.Schema({
    first_name: String,
    middle_name: String,
    last_name: String,
    email_address: String,
    username: String,
    password: String,
    date_of_birth: Date,
    designation: String,
    contact_number: String
});

module.exports = mongoose.model("Employee",EmployeeSchema);