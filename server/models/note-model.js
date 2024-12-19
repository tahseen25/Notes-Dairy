const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const noteSchema = new Schema({
    title: {
        type: String
    },
    
    body: {
        type: String,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    color: {
        type: String // Optional field
    }
});

const Note = mongoose.model('Note', noteSchema);

module.exports = Note;
