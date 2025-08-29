import React, { useEffect, useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import CloseIcon from "@mui/icons-material/Close";
import StickyNote2OutlinedIcon from '@mui/icons-material/StickyNote2Outlined';
import API from "../utils/api";
import "../styles/notes.css";

interface Note {
  _id: string;
  title: string;
  content: string;
  createdAt: string;
}

interface EditingNote {
  _id: string;
  title: string;
  content: string;
}

const Notes = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editingNote, setEditingNote] = useState<EditingNote | null>(null);

  const fetchNotes = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await API.get("/notes", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setNotes(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching notes:", error);
      setError("Failed to fetch notes");
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const token = localStorage.getItem("token");
      await API.delete(`/notes/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // Refresh notes after deletion
      fetchNotes();
    } catch (error) {
      console.error("Error deleting note:", error);
      setError("Failed to delete note");
    }
  };

  const handleEdit = (note: Note) => {
    setEditingNote({
      _id: note._id,
      title: note.title,
      content: note.content,
    });
    setIsEditing(true);
  };

  const handleUpdate = async () => {
    if (!editingNote) return;

    try {
      const token = localStorage.getItem("token");
      await API.put(
        `/notes/${editingNote._id}`,
        {
          title: editingNote.title,
          content: editingNote.content,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Refresh notes and reset editing state
      fetchNotes();
      setIsEditing(false);
      setEditingNote(null);
    } catch (error) {
      console.error("Error updating note:", error);
      setError("Failed to update note");
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditingNote(null);
  };
  useEffect(() => {
    fetchNotes();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="loading-pulse flex items-center space-x-2 text-blue-500">
          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-500 bg-red-50 rounded-lg border border-red-100 mx-4">
        <div className="text-lg font-semibold mb-2">⚠️ Error</div>
        <div>{error}</div>
      </div>
    );
  }

  return (
    <div>
      {/* Edit Modal */}
      {isEditing && editingNote && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 modal-overlay">
          <div className="bg-white rounded-lg p-6 w-full max-w-md modal-content backdrop-blur-sm bg-white/90">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-blue-700">
                Edit Note
              </h2>
              <button
                onClick={handleCancel}
                className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
              >
                <CloseIcon />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={editingNote.title}
                  onChange={(e) =>
                    setEditingNote({ ...editingNote, title: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Content
                </label>
                <textarea
                  value={editingNote.content}
                  onChange={(e) =>
                    setEditingNote({ ...editingNote, content: e.target.value })
                  }
                  rows={4}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdate}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600
                           transition-colors duration-200"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Notes List */}
      {notes.length === 0 ? (
        <div className="text-center py-12 empty-state">
          <div className="flex justify-center mb-4">
            <StickyNote2OutlinedIcon style={{ fontSize: 48 }} className="text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No Notes Yet</h3>
          <p className="text-gray-500">Create your first note to get started!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
          {notes.map((note, index) => (
            <div
              key={note._id}
              className="note-card relative overflow-hidden bg-white rounded-lg p-4"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
            <div className="flex-1">
              <h3 className="font-semibold text-lg text-gray-800 mb-2">{note.title}</h3>
              <p className="text-gray-600 mb-3 line-clamp-3">{note.content}</p>
              <p className="text-xs text-gray-400">
                {new Date(note.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                })}
              </p>
            </div>
            <div className="flex justify-end space-x-2 mt-4 border-t pt-3">
              <button
                onClick={() => handleEdit(note)}
                className="action-button flex items-center px-3 py-1.5 text-blue-600 bg-blue-50 rounded-md
                          hover:bg-blue-100 transition-all duration-200"
              >
                <EditIcon className="w-4 h-4 mr-1" />
                <span>Edit</span>
              </button>
              <button
                onClick={() => handleDelete(note._id)}
                className="action-button flex items-center px-3 py-1.5 text-red-600 bg-red-50 rounded-md
                          hover:bg-red-100 transition-all duration-200"
              >
                <DeleteOutlineIcon className="w-4 h-4 mr-1" />
                <span>Delete</span>
              </button>
            </div>
          </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notes;
