const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    firstName: String,
    lastName: String,
    emailId: String,
    password: String,
    age: Number,
    gender: String
});


module.exports = mongoose.model('User', userSchema);