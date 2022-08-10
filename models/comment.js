const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
    body: String,
    Id : Number
});

module.exports = mongoose.model("Comment", commentSchema);





