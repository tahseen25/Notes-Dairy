

// src/components/Note/Note.jsx
import React from "react";
import deleteIcon from "../../assets/delete.svg";
import "./Note.css";

function Note({ note, deleteNote, updateText }) {
  const formatDate = (value) => {
    if (!value) return "";
    const date = new Date(value);
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    let hrs = date.getHours();
    let amPm = hrs >= 12 ? "PM" : "AM";
    hrs = hrs ? hrs : "12";
    hrs = hrs > 12 ? (hrs -= 12) : hrs;
    let min = date.getMinutes();
    min = min < 10 ? "0" + min : min;
    let day = date.getDate();
    const month = monthNames[date.getMonth()];
    return `${hrs}:${min} ${amPm} ${day} ${month}`;
  };

  const handleTitleChange = (e) => {
    updateText("title", e.target.value, note._id);
  };

  const handleBodyChange = (e) => {
    updateText("body", e.target.value, note._id);
  };

  return (
    <div className="note" style={{ backgroundColor: note.color }}>
        <input
          className="note_title"
          defaultValue={note.title}
          placeholder="Title"
          onBlur={handleTitleChange}  // Update on blur for title
        />
      <textarea
        className="note_text"
        defaultValue={note.body}
        placeholder="Write your note here..."
        onBlur={handleBodyChange}  // Update on blur for body
      />
      <div className="note_footer">
        <p>{formatDate(note.createdAt)}</p>
        <img src={deleteIcon} alt="DELETE" onClick={() => deleteNote(note._id)} />
      </div>
    </div>
  );
}

export default Note;
