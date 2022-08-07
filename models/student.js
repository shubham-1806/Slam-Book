const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const StudentSchema = new Schema({
    name : String,
    Id : Number
});


module.exports = mongoose.model('student', StudentSchema);


