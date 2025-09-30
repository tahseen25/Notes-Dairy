const Diary = require('../models/diary-model');
const { encrypt, decrypt } = require('../utils/encryption');

// Create a new diary entry
const createDiaryEntry = async (req, res, next) => {
  try {
    const { title, entry, color } = req.body;
    if (!title || !entry) {
      return res.status(400).json({ message: "Title and entry are required." });
    }

    // Use per-user key
    const userKey = req.user.userKey; // ensure this is stored securely per user
    const encryptedTitle = encrypt(title, userKey);
    const encryptedEntry = encrypt(entry, userKey);

    const diary = new Diary({
      title: encryptedTitle,
      entry: encryptedEntry,
      color,
      user: req.user.id
    });

    await diary.save();
    res.status(201).json(diary);
  } catch (error) {
    console.error("Error creating diary entry:", error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Get all diary entries for a user
const getAllDiaryEntries = async (req, res, next) => {
  try {
    const diaryEntries = await Diary.find({ user: req.user.id });
    const userKey = req.user.userKey;

    // Decrypt each diary entry before sending
    const decryptedDiaries = diaryEntries.map(d => {
      const copy = d.toObject();
      copy.title = decrypt(copy.title, userKey);
      copy.entry = decrypt(copy.entry, userKey);
      return copy;
    });

    res.status(200).json(decryptedDiaries);
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
    const userKey = req.user.userKey;

    const updatedData = {};
    if (title) updatedData.title = encrypt(title, userKey);
    if (entry) updatedData.entry = encrypt(entry, userKey);

    const diary = await Diary.findByIdAndUpdate(id, updatedData, { new: true, runValidators: true });
    if (!diary) {
      return res.status(404).json({ message: "Diary entry not found." });
    }

    // Decrypt before sending
    const response = diary.toObject();
    response.title = decrypt(response.title, userKey);
    response.entry = decrypt(response.entry, userKey);

    res.status(200).json(response);
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
