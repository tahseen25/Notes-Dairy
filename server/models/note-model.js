const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption');
const Schema = mongoose.Schema;

const noteSchema = new Schema({
  title: {
    type: String
  },
  body: {
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
    type: String
  }
});

// Load encryption keys from environment variables
const encKey = process.env.ENC_KEY; // 32 bytes
const sigKey = process.env.SIG_KEY; // 64 bytes

// Apply encryption to sensitive fields
noteSchema.plugin(encrypt, {
  encryptionKey: encKey,
  signingKey: sigKey,
  encryptedFields: ["title", "body"]
});

const Note = mongoose.model('Note', noteSchema);
module.exports = Note;
