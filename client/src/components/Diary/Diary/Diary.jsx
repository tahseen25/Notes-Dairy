// src/components/Diary/Diary.jsx

import React, { useState } from "react";
import deleteIcon from "../../../assets/delete.svg";
import closeIcon from "../../../assets/close.svg"; // Close icon for minimizing the diary
import "./Diary.css";

function Diary({ diary, deleteDiaryEntry, updateText }) {
  const [isExpanded, setIsExpanded] = useState(false); // Track the expansion state

  // Format date function
  const formatDate = (value) => {
    if (!value) return "";
    const date = new Date(value);
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    let hrs = date.getHours();
    let amPm = hrs >= 12 ? "PM" : "AM";
    hrs = hrs ? hrs : "12";
    hrs = hrs > 12 ? hrs - 12 : hrs;
    let min = date.getMinutes();
    min = min < 10 ? "0" + min : min;
    let day = date.getDate();
    const month = monthNames[date.getMonth()];
    return `${hrs}:${min} ${amPm} ${day} ${month}`;
  };

  // Handle title change
  const handleTitleChange = (e) => {
    updateText("title", e.target.value, diary._id);
  };

  // Handle diary entry text change
  const handleEntryChange = (e) => {
    updateText("entry", e.target.value, diary._id);
  };

  // Toggle expansion of the diary entry
  const toggleExpand = (e) => {
    // Prevent expansion when clicking the close button
    if (!e.target.classList.contains("close-icon")) {
      setIsExpanded(true);
    }
  };

  // Collapse the diary entry when the close button is clicked
  const handleClose = (e) => {
    e.stopPropagation(); // Prevent triggering the toggleExpand function
    setIsExpanded(false);
  };

  return (
    <div
      className={`diary ${isExpanded ? "expanded" : ""}`}
      style={{ backgroundColor: diary.color || '#FFFFFF' }}
      onClick={toggleExpand} // Only expand on click, if not close button
    >
      {isExpanded && (
        <>
          <div className="diary_header">
          <img
            src={closeIcon}
            alt="CLOSE"
            className="close-icon"

            onClick={(e) => {
              e.stopPropagation(); 
            fetchDiaries(diary._id);
            }}
          />
          </div>

          <input
            className="diary_title expanded"
            value={diary.title}
            placeholder="Title"
            onChange={handleTitleChange}
            autoFocus
          />
          <textarea
            className="diary_entry expanded"
            value={diary.entry}
            placeholder="Write your diary entry here..."
            onChange={handleEntryChange}
          />
        </>
      )}
      {!isExpanded && (
        <>
          <input
            className="diary_title"
            value={diary.title}
            placeholder="Title"
            onChange={handleTitleChange}
          />
          <div className="diary_footer">
            <p>{formatDate(diary.createdAt)}</p>
            <img
              src={deleteIcon}
              alt="DELETE"
              onClick={(e) => {
                e.stopPropagation(); // Prevent triggering toggleExpand on delete
                deleteDiaryEntry(diary._id);
              }}
            />
          </div>
        </>
      )}
    </div>
  );
}

export default Diary;
