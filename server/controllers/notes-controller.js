const Note = require("../models/note-model");
const { encrypt, decrypt } = require('../utils/encryption');

// Get all notes for a user
const getAllNotes = async (req, res, next) => {
  try {
    const notes = await Note.find({ user: req.user.id });
    const userKey = req.user.userKey;

    const decryptedNotes = notes.map(n => {
      const copy = n.toObject();
      if (copy.title) copy.title = decrypt(copy.title, userKey);
      if (copy.body) copy.body = decrypt(copy.body, userKey);
      return copy;
    });

    res.status(200).json(decryptedNotes);
  } catch (error) {
    console.error("Error fetching notes:", error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Create a new note
const createNote = async (req, res, next) => {
  try {
    const { title, body, color } = req.body;
    const userKey = req.user.userKey;

    const encryptedTitle = title ? encrypt(title, userKey) : '';
    const encryptedBody = body ? encrypt(body, userKey) : '';

    const note = new Note({
      title: encryptedTitle,
      body: encryptedBody,
      color,
      user: req.user.id
    });

    await note.save();
    res.status(201).json(note);
  } catch (error) {
    console.error("Error creating note:", error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Update a note by ID
const updateNote = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, body } = req.body;
    const userKey = req.user.userKey;

    const updatedData = {};
    if (title) updatedData.title = encrypt(title, userKey);
    if (body) updatedData.body = encrypt(body, userKey);

    const note = await Note.findByIdAndUpdate(id, updatedData, { new: true });
    if (!note) return res.status(404).json({ message: "Note not found." });

    const response = note.toObject();
    if (response.title) response.title = decrypt(response.title, userKey);
    if (response.body) response.body = decrypt(response.body, userKey);

    res.status(200).json(response);
  } catch (error) {
    console.error("Error updating note:", error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Delete a note by ID
const deleteNote = async (req, res, next) => {
  try {
    const { id } = req.params;
    const note = await Note.findByIdAndDelete(id);
    if (!note) return res.status(404).json({ message: "Note not found." });
    res.status(200).json({ msg: "Note deleted" });
  } catch (error) {
    console.error("Error deleting note:", error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = { getAllNotes, createNote, updateNote, deleteNote };
