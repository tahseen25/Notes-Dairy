// src/components/NoteContainer/NoteContainer.jsx
import React from "react";
import Note from "../Note/Note";
import "./NoteContainer.css";

function NoteContainer({ notes, deleteNote, updateText }) {
  const reversedNotes = (notes) => [...notes].reverse();

  return (
    <div className="note-container">
      <h2>Notes</h2>
      <div className="note-container_notes custom-scroll">
        {reversedNotes(notes).map((note) => (
          <Note
            key={note._id}
            note={note}
            deleteNote={deleteNote}
            updateText={updateText}
          />
        ))}
      </div>
    </div>
  );
}

export default NoteContainer;

