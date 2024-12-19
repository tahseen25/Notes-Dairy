const Note = require("../models/note-model");

const getAllNotes = async (req, res, next) => {
  try {
    const notes = await Note.find({ userId: req.user.id });
    res.status(200).json(notes);
  } catch (error) {
    next(error);
  }
};

const createNote = async (req, res, next) => {
  try {
    const { title, content } = req.body;
    const note = new Note({ title, content, userId: req.user.id });
    await note.save();
    res.status(201).json(note);
  } catch (error) {
    next(error);
  }
};

const updateNote = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;
    const note = await Note.findByIdAndUpdate(id, { title, content }, { new: true });
    res.status(200).json(note);
  } catch (error) {
    next(error);
  }
};

const deleteNote = async (req, res, next) => {
  try {
    const { id } = req.params;
    await Note.findByIdAndDelete(id);
    res.status(200).json({ msg: "Note deleted" });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAllNotes, createNote, updateNote, deleteNote };
