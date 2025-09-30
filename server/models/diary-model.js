const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { encrypt, decrypt } = require('../utils/encryption');

const diarySchema = new Schema({
    title: {
        type: String
    },
    entry: {
        type: String
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
    }
});

// Encrypt before saving
diarySchema.pre('save', function(next) {
    if (this.isModified('title') && this.title && this.userKey) {
        this.title = encrypt(this.title, this.userKey);
    }
    if (this.isModified('entry') && this.entry && this.userKey) {
        this.entry = encrypt(this.entry, this.userKey);
    }
    next();
});

// Decrypt after fetching
diarySchema.methods.decryptFields = function(userKey) {
    if (this.title) this.title = decrypt(this.title, userKey);
    if (this.entry) this.entry = decrypt(this.entry, userKey);
};

const Diary = mongoose.model('Diary', diarySchema);

module.exports = Diary;
