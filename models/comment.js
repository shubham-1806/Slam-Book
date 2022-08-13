const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
    body: String,
    Id : Number,
    name : String
});

module.exports = mongoose.model("Comment", commentSchema);





