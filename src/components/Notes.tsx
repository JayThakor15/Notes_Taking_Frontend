import { useEffect, useState, useRef } from "react";
// @ts-ignore - jsPDF types may not be present if not installed with @types
import jsPDF from "jspdf";
import EditIcon from "@mui/icons-material/Edit";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import CloseIcon from "@mui/icons-material/Close";
import StickyNote2OutlinedIcon from "@mui/icons-material/StickyNote2Outlined";
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";
// import GeneratedContentModal from "./GeneratedContentModal"; // currently unused
import { CircularProgress } from "@mui/material";
import API, { generateContent } from "../utils/api";
import "../styles/notes.css";
import "../styles/notebook.css"; // reuse lined paper styles

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
  const [isGenerating, setIsGenerating] = useState(false);
  const [showGeneratedContent, setShowGeneratedContent] = useState(false);
  const [generatedContent, setGeneratedContent] = useState("");
  const editTextareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [viewingNote, setViewingNote] = useState<Note | null>(null); // view-only modal

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

  const handleGenerateContent = async () => {
    if (!editingNote) return;

    try {
      setIsGenerating(true);
      const content = await generateContent(editingNote.content);
      setGeneratedContent(content);
      setShowGeneratedContent(true);
    } catch (error) {
      console.error("Error generating content:", error);
      setError("Failed to generate content");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleApplyGeneratedContent = (content: string) => {
    if (editingNote) {
      setEditingNote({ ...editingNote, content });
    }
    setShowGeneratedContent(false);
  };

  const exportNoteToPDF = (note: { title: string; content: string }) => {
    const doc = new jsPDF({ unit: "pt", format: "a4" });
    const marginX = 48;
    const marginTop = 56;
    const lineHeight = 18;
    const pageWidth = doc.internal.pageSize.getWidth();
    const usableWidth = pageWidth - marginX * 2;
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(18);
    doc.text(note.title || "Untitled Note", marginX, marginTop);
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(12);
    let y = marginTop + 28;
    const paragraphs = (note.content || "").split(/\n\n+/);
    paragraphs.forEach((para) => {
      const lines = doc.splitTextToSize(para.replace(/\n/g, " "), usableWidth);
      lines.forEach((l: string) => {
        if (y > doc.internal.pageSize.getHeight() - 72) {
          doc.addPage();
          y = marginTop;
        }
        doc.text(l, marginX, y);
        y += lineHeight;
      });
      y += lineHeight * 0.5;
    });
    const fileName =
      (note.title || "note").replace(/[^a-z0-9\-_]+/gi, "_") + ".pdf";
    doc.save(fileName);
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
      {/* View Note Modal */}
      {viewingNote && !isEditing && (
        <div
          className="fixed inset-0 bg-white/30 backdrop-blur-sm flex items-center justify-center z-50 modal-overlay"
          onClick={() => setViewingNote(null)}
        >
          <div
            className="bg-white rounded-lg shadow-xl max-w-2xl w-full h-[80vh] flex flex-col overflow-hidden modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center px-6 pt-6 pb-3 border-b border-gray-100">
              <h2 className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-blue-700">
                {viewingNote.title || "Untitled Note"}
              </h2>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => exportNoteToPDF(viewingNote)}
                  className="px-3 py-1.5 text-sm bg-green-50 text-green-600 rounded-md hover:bg-green-100 transition-colors"
                >
                  Download
                </button>
                <button
                  onClick={() => {
                    // Switch to edit mode with this note
                    setEditingNote({
                      _id: viewingNote._id,
                      title: viewingNote.title,
                      content: viewingNote.content,
                    });
                    setViewingNote(null);
                    setIsEditing(true);
                  }}
                  className="px-3 py-1.5 text-sm bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => setViewingNote(null)}
                  className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
                >
                  <CloseIcon />
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto px-6 pb-6 pt-4">
              <div className="notebook-paper" style={{ paddingTop: "1rem" }}>
                <div
                  className="whitespace-pre-wrap text-gray-700 leading-relaxed"
                  style={{ background: "transparent" }}
                >
                  {viewingNote.content || "No content"}
                </div>
              </div>
            </div>
            <div className="px-6 py-3 border-t text-xs text-gray-400 bg-white flex justify-between items-center">
              <span>
                {new Date(viewingNote.createdAt).toLocaleString("en-US", {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </span>
              <button
                onClick={() => setViewingNote(null)}
                className="px-3 py-1 text-gray-500 hover:text-gray-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Edit and Generate Content Modals */}
      {isEditing && editingNote && (
        <div className="fixed inset-0 bg-white/30 backdrop-blur-sm z-50 modal-overlay flex">
          <div
            className={`flex w-screen h-screen p-6 gap-6 transition-all duration-300 ease-in-out`}
          >
            {/* Edit Modal */}
            <div
              className={`bg-white rounded-lg p-0 w-full ${
                showGeneratedContent ? "flex-[3] h-full" : "h-full"
              } modal-content shadow-xl flex flex-col`}
              style={{ overflow: "hidden" }}
            >
              <div className="flex justify-between items-center px-6 pt-6 pb-3 border-b border-gray-100">
                <h2 className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-blue-700">
                  Edit Note
                </h2>
                <button
                  onClick={handleCancel}
                  className="text-gray-500 hover:text-gray-700 transition-colors duration-200 p-1"
                  aria-label="Close edit modal"
                >
                  <CloseIcon />
                </button>
              </div>
              <div className="flex-1 px-6 pb-4 pt-4 overflow-hidden">
                <div className="notebook-paper h-full flex flex-col overflow-hidden">
                  <input
                    type="text"
                    value={editingNote.title}
                    onChange={(e) =>
                      setEditingNote({ ...editingNote, title: e.target.value })
                    }
                    placeholder="Title..."
                    className="notebook-title w-full bg-transparent focus:outline-none"
                    style={{ border: "none" }}
                  />
                  <textarea
                    ref={editTextareaRef}
                    value={editingNote.content}
                    onChange={(e) =>
                      setEditingNote({
                        ...editingNote,
                        content: e.target.value,
                      })
                    }
                    placeholder="Edit your note here..."
                    className="w-full bg-transparent focus:outline-none flex-1 resize-none"
                    style={{ minHeight: "0" }}
                  />
                </div>
              </div>
              <div className="px-6 py-4 border-t border-gray-100 flex items-center space-x-3 justify-end bg-white">
                <button
                  onClick={() => editingNote && exportNoteToPDF(editingNote)}
                  className="flex items-center px-4 py-2 text-green-600 bg-green-50 rounded-md hover:bg-green-100 transition-colors duration-200"
                >
                  Download
                </button>
                <button
                  onClick={handleGenerateContent}
                  disabled={isGenerating}
                  className="flex items-center px-4 py-2 text-purple-600 bg-purple-50 rounded-md hover:bg-purple-100 transition-colors duration-200 disabled:opacity-50"
                >
                  {isGenerating ? (
                    <CircularProgress size={20} className="mr-2" />
                  ) : (
                    <AutoFixHighIcon className="mr-2" />
                  )}
                  Generate
                </button>
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdate}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-200"
                >
                  Save
                </button>
              </div>
            </div>

            {/* Generated Content Panel */}
            {showGeneratedContent && (
              <div className="bg-white rounded-lg p-6 w-full flex-[2] shadow-xl border-l-4 border-purple-500 h-full overflow-y-auto flex-shrink-0">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-purple-700">
                    Generated Content
                  </h2>
                  <button
                    onClick={() => setShowGeneratedContent(false)}
                    className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
                  >
                    <CloseIcon />
                  </button>
                </div>
                <div className="space-y-4">
                  <div className="prose max-w-none">
                    <div className="bg-gray-50 p-4 rounded-md">
                      {generatedContent}
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <button
                      onClick={() =>
                        handleApplyGeneratedContent(generatedContent)
                      }
                      className="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600
                               transition-colors duration-200"
                    >
                      Apply Content
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Notes List */}
      {notes.length === 0 ? (
        <div className="text-center py-12 empty-state">
          <div className="flex justify-center mb-4">
            <StickyNote2OutlinedIcon
              style={{ fontSize: 48 }}
              className="text-gray-400"
            />
          </div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">
            No Notes Yet
          </h3>
          <p className="text-gray-500">
            Create your first note to get started!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4 p-4">
          {notes.map((note, index) => (
            <div
              key={note._id}
              className="note-card relative overflow-hidden bg-white rounded-lg p-4 cursor-pointer flex flex-col min-h-[230px] shadow-sm hover:shadow-md transition-shadow"
              style={{ animationDelay: `${index * 0.1}s` }}
              onClick={() => setViewingNote(note)}
            >
              <div className="flex-1 flex flex-col">
                <h3 className="font-semibold text-lg text-gray-800 mb-2">
                  {note.title}
                </h3>
                <p className="text-gray-600 mb-3 line-clamp-3">
                  {note.content}
                </p>
                <p className="text-xs text-gray-400">
                  {new Date(note.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </p>
              </div>
              <div className="flex justify-end space-x-2 mt-4 border-t pt-3">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    exportNoteToPDF({
                      title: note.title,
                      content: note.content,
                    });
                  }}
                  className="action-button flex items-center px-3 py-1.5 text-green-600 bg-green-50 rounded-md
                          hover:bg-green-100 transition-all duration-200"
                >
                  <FileDownloadOutlinedIcon className="w-4 h-4 mr-1" />
                  <span>Download</span>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEdit(note);
                  }}
                  className="action-button flex items-center px-3 py-1.5 text-blue-600 bg-blue-50 rounded-md
                          hover:bg-blue-100 transition-all duration-200"
                >
                  <EditIcon className="w-4 h-4 mr-1" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(note._id);
                  }}
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
