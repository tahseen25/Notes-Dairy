import React, { useEffect, useState } from 'react';
import axios from 'axios';
import NoteContainer from '../components/NoteContainer/NoteContainer';
import Sidebar from '../components/Sidebar/Sidebar';
import "./Notes.css";

export const Notes = () => {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/auth/note', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setNotes(response.data.notes);
    } catch (error) {
      console.error('Error fetching notes:', error);
    }
  };

  const addNote = async (color) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:5000/api/auth/note/create',
        {
          title: '',
          body: '',
          color,  // Pass the selected color
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.status === 1) {
        // Add the new note to the state immediately
        setNotes((prevNotes) => [...prevNotes, response.data.note]);
      } else {
        console.error('Failed to add note:', response.data.message);
      }
    } catch (error) {
      console.error('Error adding note:', error);
    }
  };

  const deleteNote = async (id) => {
    try {
      const response = await axios.delete(
        `http://localhost:5000/api/auth/note/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      if (response.data.status === 1) {
        // Remove the note from the state
        setNotes((prevNotes) => prevNotes.filter(note => note._id !== id));
      }
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  const updateText = async (field, value, id) => {
    try {
      const response = await axios.patch(
        `http://localhost:5000/api/auth/note/${id}`,
        {
          [field]: value,  // Update either title or body
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      if (response.data.status === 1) {
        // Update the note in the state
        setNotes((prevNotes) =>
          prevNotes.map(note => note._id === id ? { ...note, [field]: value } : note)
        );
      }
    } catch (error) {
      console.error('Error updating note:', error);
    }
  };

  return (
    <div className="notes-page">
      <Sidebar addNote={addNote} />
      <NoteContainer
        notes={notes}
        deleteNote={deleteNote}
        updateText={updateText}
      />
    </div>
  );
};
