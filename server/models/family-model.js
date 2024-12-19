const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const familySchema = new Schema({
    name: {
        type: String, 
        trim: true       
    },
    birthday: {
        type: String,      
    },
    contact: {
        email: {
            type: String,
            match: [/\S+@\S+\.\S+/, 'Invalid email format'], 
        },
        phone: {
            type: String,
            match: [/^\+?[0-9\s\-]{7,15}$/, 'Invalid phone number format'],  
        }
    },
    address: {
        street: { type: String },
        city: { type: String },
        state: { type: String },
        country: { type: String },
        zipCode: { type: String }
    },
    hobby: {
        type: String,
        trim: true
    },
    song: {
        type: String,
        trim: true
    },
    movie: {
        type: String,
        trim: true
    },
    gift: {
        type: String,
        trim: true
    },
    memory: {
        type: String,
        trim: true
    },
    quote: {
        type: String,
        trim: true
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
        type: String,
        default: '#FFFFFF'
    },
    characterIcon: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Icon',
        required: false
    }
});

familySchema.index({ user: 1 });

const Family = mongoose.model('Family', familySchema);

module.exports = Family;
