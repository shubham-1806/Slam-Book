const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AlumniSchema = new Schema({
    name : String,
    YearOfGraduation : Number
});

module.exports = mongoose.model('alumni', AlumniSchema);

