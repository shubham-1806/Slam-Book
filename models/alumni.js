const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AlumniSchema = new Schema({
    name : String,
    Id : Number,
    comments : [
        {
            type : Schema.Types.ObjectId,
            ref : 'Comment'
        }
    ]
});

module.exports = mongoose.model('alumni', AlumniSchema);

