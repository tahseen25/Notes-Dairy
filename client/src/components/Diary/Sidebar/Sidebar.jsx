// src/components/Sidebar/Sidebar.jsx

import React, { useState } from "react";
import plusIcon from "../../../assets/plus.svg";
import "./Sidebar.css";

function Sidebar({ addDiaryEntry }) {
  const colors = ["#ffadad", "#ffd6a5", "#fdffb6", "#caffbf", "#9bf6ff", "#a0c4ff"];
  const [listOpen, setListOpen] = useState(false);

  return (
    <div className="sidebar">
      <img src={plusIcon} alt="Add" onClick={() => setListOpen(!listOpen)} />
      <ul className={`sidebar_list ${listOpen ? "sidebar_list_active" : ""}`}>
        {colors.map((color, index) => (
          <li
            key={index}
            className="sidebar_list_item"
            style={{ backgroundColor: color }}
            onClick={() => {
              setListOpen(false); // Close the color list after selection
              addDiaryEntry(color);
            }}
          />
        ))}
      </ul>
    </div>
  );
}

export default Sidebar;
