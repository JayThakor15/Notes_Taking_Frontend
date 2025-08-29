import React, { useEffect, useState } from "react";
import Navigation from "../components/navigation";
import Notes from "../components/Notes";
import {
  Modal,
  IconButton,
  TextField,
  Button,
  Tooltip,
  Zoom,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CreateIcon from "@mui/icons-material/Create";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import API, { addNote } from "../utils/api";
import "../styles/notebook.css";

interface NewNote {
  title: string;
  content: string;
}

const Dashboard = () => {
  const [name, setname] = useState("User");
  const [email, setEmail] = useState("User");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [newNote, setNewNote] = useState<NewNote>({ title: "", content: "" });

  const handleCloseModal = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsCreateModalOpen(false);
      setIsClosing(false);
    }, 200); // Match this with the animation duration
  };

  useEffect(() => {
    const userString = localStorage.getItem("user");
    const user = userString ? JSON.parse(userString) : null;
    console.log(user);

    if (user) {
      setname(user?.name);
      setEmail(user?.email);
    }

    return () => {};
  }, []);

  return (
    <div className="flex w-full h-screen bg-gray-50">
      {/* Fixed Navigation Sidebar */}
      <div className="w-64 shadow-xl h-screen fixed left-0 top-0 bg-white">
        <Navigation onCreateNote={() => setIsCreateModalOpen(true)} />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 ml-64">
        {/* Fixed Header */}
        <div className="fixed top-0 right-0 left-64 bg-white z-10">
          {/* User Info Section */}
          <div className="p-6 shadow-lg rounded-2xl">
            <h1 className="text-2xl font-semibold">Dashboard</h1>
            <p className="mt-2 font-medium text-gray-600">Welcome, {name}!</p>
            <p className="mt-2 text-gray-600">Your email: {email}</p>
          </div>

          {/* Create Note Section */}
          <div className="px-6 py-4">
            <Tooltip title="Create a new note" TransitionComponent={Zoom} arrow>
              <div
                onClick={() => setIsCreateModalOpen(true)}
                className="group p-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 
                          rounded-lg flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer"
              >
                <NoteAddIcon className="text-white mr-2 transform group-hover:scale-110 transition-transform duration-200" />
                <span className="font-bold text-white">Create Note</span>
              </div>
            </Tooltip>
          </div>
        </div>

        {/* Scrollable Notes Section */}
        <div className="mt-48 p-6 bg-white shadow-md">
          <h2 className="text-xl font-semibold h-30 mt-4">Notes</h2>
          <div className="overflow-y-auto">
            <Notes />
          </div>
        </div>
      </div>

      {/* Create Note Modal */}
      <Modal
        open={isCreateModalOpen}
        onClose={handleCloseModal}
        aria-labelledby="create-note-modal"
        className="flex items-center justify-center modal-overlay"
      >
        <div
          className={`bg-white p-6 rounded-lg w-11/12 max-w-2xl relative modal-content ${
            isClosing ? "closing" : ""
          }`}
          style={{ boxShadow: "0 0 15px rgba(0,0,0,0.1)" }}
        >
          <Tooltip title="Close" arrow placement="top">
            <IconButton
              aria-label="close"
              onClick={handleCloseModal}
              className="absolute top-2 right-2 z-10 hover:rotate-90 transition-transform duration-300"
              sx={{
                color: "rgba(0,0,0,0.6)",
                "&:hover": {
                  color: "rgba(0,0,0,0.8)",
                  backgroundColor: "rgba(0,0,0,0.04)",
                },
              }}
            >
              <CloseIcon />
            </IconButton>
          </Tooltip>

          <div
            className="relative"
            style={{
              background:
                "linear-gradient(to bottom, #f8f9fa 0%, #ffffff 100%)",
              padding: "16px",
              borderRadius: "12px",
              boxShadow: "inset 0 2px 4px rgba(0,0,0,0.05)",
            }}
          >
            <div
              className="absolute top-0 left-0 right-0 h-[24px]"
              style={{
                background:
                  "repeating-linear-gradient(90deg, #3b82f6, #3b82f6 2px, transparent 2px, transparent 15px)",
                opacity: "0.15",
                borderTopLeftRadius: "12px",
                borderTopRightRadius: "12px",
              }}
            ></div>

            <div className="flex items-center mb-4 mt-1">
              <CreateIcon className="text-blue-500 mr-2" />
              <h2 className="text-xl font-semibold text-gray-800">New Note</h2>
            </div>

            {/* Notebook-style input fields */}
            <div className="space-y-4">
              <TextField
                fullWidth
                placeholder="Give your note a title..."
                variant="standard"
                value={newNote.title}
                onChange={(e) =>
                  setNewNote({ ...newNote, title: e.target.value })
                }
                className="notebook-title"
                InputProps={{
                  disableUnderline: true,
                  style: { fontSize: "1.25rem", fontWeight: 500 },
                }}
              />

              <TextField
                fullWidth
                multiline
                rows={6}
                placeholder="Start writing your thoughts here..."
                variant="standard"
                value={newNote.content}
                onChange={(e) =>
                  setNewNote({ ...newNote, content: e.target.value })
                }
                className="notebook-paper"
                InputProps={{ disableUnderline: true }}
              />
            </div>

            <div className="mt-4 flex justify-end gap-3">
              <Tooltip title="Cancel" arrow>
                <Button
                  variant="outlined"
                  onClick={handleCloseModal}
                  startIcon={<CancelIcon />}
                  className="hover:bg-red-50"
                  sx={{
                    borderColor: "rgba(239, 68, 68, 0.5)",
                    color: "rgb(239, 68, 68)",
                    "&:hover": {
                      borderColor: "rgb(239, 68, 68)",
                      backgroundColor: "rgba(239, 68, 68, 0.04)",
                    },
                  }}
                >
                  Cancel
                </Button>
              </Tooltip>
              <Tooltip title="Save note" arrow>
                <Button
                  variant="contained"
                  onClick={async () => {
                    try {
                      await addNote(newNote);
                      handleCloseModal();
                      setNewNote({ title: "", content: "" });
                    } catch (error) {
                      console.error("Failed to create note:", error);
                    }
                  }}
                  startIcon={<SaveIcon />}
                  className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700
                            transform hover:scale-105 transition-all duration-200"
                >
                  Save Note
                </Button>
              </Tooltip>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Dashboard;
