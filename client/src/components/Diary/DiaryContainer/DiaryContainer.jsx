// src/components/DiaryContainer/DiaryContainer.jsx

import React from "react";
import Diary from "../Diary/Diary"; // Correct default import
import "./DiaryContainer.css";

function DiaryContainer({ diaries, deleteDiaryEntry, updateText }) {
  const reversedDiaries = (diaries) => [...diaries].reverse();

  return (
    <div className="diary-container">
      <h2>Diaries</h2>
      <div className="diary-container_diaries custom-scroll">
        {reversedDiaries(diaries).map((diary) => (
          <Diary
            key={diary._id}
            diary={diary}
            deleteDiaryEntry={deleteDiaryEntry}
            updateText={updateText}
          />
        ))}
      </div>
    </div>
  );
}

export default DiaryContainer;
