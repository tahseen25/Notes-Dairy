// src/pages/Diaries.jsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DiaryContainer from '../components/Diary/DiaryContainer/DiaryContainer';
import Sidebar from '../components/Diary/Sidebar/Sidebar';
import "./Diaries.css";

export const Diaries = () => {
  const [diaries, setDiaries] = useState([]);

  useEffect(() => {
    fetchDiaries();
  }, []);

  const fetchDiaries = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/auth/diary', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setDiaries(response.data);
    } catch (error) {
      console.error('Error fetching diaries:', error);
    }
  };

  const addDiaryEntry = async (color) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:5000/api/auth/diary/create',
        {
          title: ' ',  // Sample title
          entry: ' ',  // Sample entry
          color,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setDiaries((prevDiaries) => [...prevDiaries, response.data]);
    } catch (error) {
      console.error('Error adding diary entry:', error.response ? error.response.data : error.message);
    }
  };

  const deleteDiaryEntry = async (id) => {
    try {
      await axios.delete(
        `http://localhost:5000/api/auth/diary/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      setDiaries((prevDiaries) => prevDiaries.filter((diary) => diary._id !== id));
    } catch (error) {
      console.error('Error deleting diary entry:', error);
    }
  };

  const updateText = async (field, value, id) => {
    try {
      await axios.patch(
        `http://localhost:5000/api/auth/diary/${id}`,
        {
          [field]: value,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      setDiaries((prevDiaries) =>
        prevDiaries.map((diary) => (diary._id === id ? { ...diary, [field]: value } : diary))
      );
    } catch (error) {
      console.error('Error updating diary entry:', error);
    }
  };

  return (
    <div className="diaries-page">
      <Sidebar addDiaryEntry={addDiaryEntry} />
      <DiaryContainer
        diaries={diaries}
        deleteDiaryEntry={deleteDiaryEntry}
        updateText={updateText}
      />
    </div>
  );
};

export default Diaries;
