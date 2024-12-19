const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const iconSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    imageUrl: {
        type: String, 
        required: true
    }
});

const Icon = mongoose.model('Icon', iconSchema);

module.exports = Icon;
