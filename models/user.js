const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name : String,
    Id : Number,
    type : String,
    comments : [
        {
            type : Schema.Types.ObjectId,
            ref : 'Comment'
        }
    ]
});

module.exports = mongoose.model('user', UserSchema);

