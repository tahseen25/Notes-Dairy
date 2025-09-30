const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption');
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

// Load encryption keys from environment variables
const encKey = process.env.ENC_KEY;
const sigKey = process.env.SIG_KEY;

// Apply encryption to sensitive fields
diarySchema.plugin(encrypt, {
  encryptionKey: encKey,
  signingKey: sigKey,
  encryptedFields: ["title", "entry"]
});

const Diary = mongoose.model('Diary', diarySchema);
module.exports = Diary;
