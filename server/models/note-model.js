const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { encrypt, decrypt } = require('../utils/encryption');

const noteSchema = new Schema({
    title: String,
    body: String,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    color: String
});

// Encrypt before saving
noteSchema.pre('save', function(next) {
    if (this.isModified('title') && this.title && this.userKey) {
        this.title = encrypt(this.title, this.userKey);
    }
    if (this.isModified('body') && this.body && this.userKey) {
        this.body = encrypt(this.body, this.userKey);
    }
    next();
});

// Decrypt after fetching
noteSchema.methods.decryptFields = function(userKey) {
    if (this.title) this.title = decrypt(this.title, userKey);
    if (this.body) this.body = decrypt(this.body, userKey);
};

const Note = mongoose.model('Note', noteSchema);

module.exports = Note;
