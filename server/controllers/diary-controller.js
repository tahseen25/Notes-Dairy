// src/controllers/diary-controller.js
const Diary = require('../models/diary-model');

// Create a new diary entry
const createDiaryEntry = async (req, res, next) => {
  try {
    const { title, entry, color } = req.body;
    if (!title || !entry) {
      return res.status(400).json({ message: "Title and entry are required." });
    }
    const diary = new Diary({ title, entry, color, user: req.user.id });
    await diary.save();
    res.status(201).json(diary);
  } catch (error) {
    console.error("Error creating diary entry:", error);  // Log error details
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Get all diary entries for a user
const getAllDiaryEntries = async (req, res, next) => {
  try {
    const diaryEntries = await Diary.find({ user: req.user.id });
    res.status(200).json(diaryEntries);
  } catch (error) {
    console.error("Error fetching diary entries:", error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Update a diary entry by ID
const updateDiaryEntry = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, entry } = req.body;
    const diary = await Diary.findByIdAndUpdate(
      id,
      { title, entry },
      { new: true, runValidators: true }
    );
    if (!diary) {
      return res.status(404).json({ message: "Diary entry not found." });
    }
    res.status(200).json(diary);
  } catch (error) {
    console.error("Error updating diary entry:", error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Delete a diary entry by ID
const deleteDiaryEntry = async (req, res, next) => {
  try {
    const { id } = req.params;
    const diary = await Diary.findByIdAndDelete(id);
    if (!diary) {
      return res.status(404).json({ message: "Diary entry not found." });
    }
    res.status(200).json({ message: 'Diary entry deleted' });
  } catch (error) {
    console.error("Error deleting diary entry:", error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = {
  createDiaryEntry,
  getAllDiaryEntries,
  updateDiaryEntry,
  deleteDiaryEntry
};
