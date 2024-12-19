const express = require("express");
const noteRouter = express.Router();
const authMiddleware = require("../middlewares/auth-middleware");
noteRouter.use(authMiddleware);

const Note = require("../models/note-model");

// Get all notes written by the user
noteRouter.get("/", async (req, res) => {
    try {
        const userID = req.userID;
        const notes = await Note.find({ user: userID });
        res.send({
            notes: notes,
            message: "Notes retrieved successfully",
            status: 1,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: "Failed to retrieve notes",
            status: 0
        });
    }
});


// Create a new note
noteRouter.post("/create", async (req, res) => {
    try {
        const userID = req.userID;
        let note = new Note({
            title: req.body.title,
            body: req.body.body,
            user: userID,
            color: req.body.color  // Adjust according to your schema
        });
        await note.save();
        res.send({
            message: "Note created",
            status: 1,
            note: note  // Optionally return the created note
        });
    } catch (error) {
        console.log(error);
        res.status(400).send({
            message: "Failed to create note",
            status: 0
        });
    }
});



// Update a selected note by its ID
noteRouter.patch("/:id", async (req, res) => {
    try {
        const noteID = req.params.id;
        const userID = req.userID;
        const updatedNote = await Note.findOneAndUpdate(
            { _id: noteID, user: userID },
            req.body,
            { new: true, runValidators: true }
        );

        if (!updatedNote) {
            return res.status(404).send({
                message: "Note not found or not authorized",
                status: 0
            });
        }

        res.send({
            message: "Note updated successfully",
            status: 1,
            note: updatedNote
        });
    } catch (error) {
        console.log(error);
        res.status(400).send({
            message: "Failed to update note",
            status: 0
        });
    }
});

// Delete a selected note by its ID
noteRouter.delete("/:id", async (req, res) => {
    try {
        const noteID = req.params.id;
        const userID = req.userID;
        const deletedNote = await Note.findOneAndDelete({ _id: noteID, user: userID });

        if (!deletedNote) {
            return res.status(404).send({
                message: "Note not found or not authorized",
                status: 0
            });
        }

        res.send({
            message: "Note deleted successfully",
            status: 1,
            note: deletedNote
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: "Failed to delete note",
            status: 0
        });
    }
});

module.exports = noteRouter;
