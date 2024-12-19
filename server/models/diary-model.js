const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const diarySchema = new Schema({
    title: {
        type: String,
        required: true
    },
    entry: {
        type: String,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the user who owns the diary entry
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    color: {
        type: String ,// Optional field
        default: '#FFFFFF'
    }
});

const Diary = mongoose.model('Diary', diarySchema);

module.exports = Diary;
