import React, { useEffect, useState, useRef } from "react";
import Navigation from "../components/navigation";
import Notes from "../components/Notes";
import UserProfile from "../components/UserProfile";
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
import { addNote, generateContent } from "../utils/api";
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";
import MenuIcon from "@mui/icons-material/Menu";
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
  const [isGenerating, setIsGenerating] = useState(false);
  const [showGeneratedContent, setShowGeneratedContent] = useState(false);
  const [generatedContent, setGeneratedContent] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const noteContentRef = useRef<HTMLTextAreaElement | null>(null);

  const handleCloseModal = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsCreateModalOpen(false);
      setIsClosing(false);
    }, 200);
  };

  useEffect(() => {
    const userString = localStorage.getItem("user");
    const user = userString ? JSON.parse(userString) : null;
    console.log(user);

    if (user) {
      setname(user?.name);
      setEmail(user?.email);
    }
  }, []);

  return (
    <div className="flex w-full h-screen bg-gray-50 relative">
      {/* Hamburger Menu Button - Visible only on mobile */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <IconButton
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="bg-white shadow-md hover:bg-gray-100"
          size="large"
        >
          <MenuIcon />
        </IconButton>
      </div>

      {/* Overlay for mobile when sidebar is open */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Fixed Navigation Sidebar */}
      <div
        className={`${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 w-64 shadow-xl h-screen fixed left-0 top-0 bg-white z-40 transition-transform duration-300 ease-in-out`}
      >
        <Navigation onCreateNote={() => setIsCreateModalOpen(true)} />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 md:ml-64 transition-all duration-300">
        {/* Fixed Header */}
        <div className="fixed top-0 right-0 left-0 md:left-64 bg-white z-10">
          {/* User Info Section */}
          <div className="p-4 md:p-6 shadow-lg rounded-2xl mt-14 md:mt-0">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-xl md:text-2xl font-semibold">Dashboard</h1>
                <p className="mt-2 font-medium text-gray-600">
                  Welcome, {name}!
                </p>
              </div>
              <UserProfile
                name={name}
                email={email}
                profilePicture={
                  localStorage.getItem("user")
                    ? JSON.parse(localStorage.getItem("user")!).profilePicture
                    : undefined
                }
              />
            </div>
          </div>

          {/* Create Note Section */}
          <div className="px-4 md:px-6 py-4">
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
        <div className="mt-56 md:mt-48 p-4 md:p-6 bg-white shadow-md">
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
        className="flex items-center justify-center modal-overlay p-4"
      >
        <div
          className={`bg-white rounded-lg relative modal-content flex flex-col lg:flex-row gap-4 p-4 transition-all duration-300 ${
            isClosing ? "closing" : ""
          } ${showGeneratedContent ? "w-11/12 max-w-7xl" : "w-[95%] max-w-[600px]"}`}
          style={{
            boxShadow: "0 0 15px rgba(0,0,0,0.1)",
            maxHeight: "85vh",
          }}
        >
          {/* Main Create Note Panel */}
          <div
            className={`bg-white rounded-lg flex flex-col h-[80vh] transition-all duration-300 ${
              showGeneratedContent ? "lg:flex-1" : "w-full"
            }`}
          >
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <CreateIcon className="text-blue-500 mr-2" />
                  <h2 className="text-xl font-semibold text-gray-800">
                    New Note
                  </h2>
                </div>
                <IconButton
                  aria-label="close"
                  onClick={handleCloseModal}
                  className="hover:rotate-90 transition-transform duration-300"
                  size="small"
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              </div>
            </div>

            <div className="flex-1 p-4 overflow-hidden">
              <div
                className="relative h-full overflow-y-auto"
                style={{
                  background:
                    "linear-gradient(to bottom, #f8f9fa 0%, #ffffff 100%)",
                  borderRadius: "12px",
                  boxShadow: "inset 0 2px 4px rgba(0,0,0,0.05)",
                }}
              >
                <div
                  className="sticky top-0 left-0 right-0 h-[24px]"
                  style={{
                    background:
                      "repeating-linear-gradient(90deg, #3b82f6, #3b82f6 2px, transparent 2px, transparent 15px)",
                    opacity: "0.15",
                    borderTopLeftRadius: "12px",
                    borderTopRightRadius: "12px",
                  }}
                />

                <div className="p-6 pt-2">
                  {/* Title above lines */}
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
                      style: {
                        fontSize: "1.35rem",
                        fontWeight: 600,
                        background: "transparent",
                        padding: 0,
                      },
                    }}
                  />
                  <div className="mt-1 notebook-paper">
                    <TextField
                      fullWidth
                      multiline
                      minRows={12}
                      placeholder="Start writing your thoughts here..."
                      variant="standard"
                      value={newNote.content}
                      onChange={(e) => {
                        const target = e.target as HTMLTextAreaElement;
                        target.style.height = "auto";
                        target.style.height = target.scrollHeight + "px";
                        setNewNote({ ...newNote, content: e.target.value });
                      }}
                      inputRef={noteContentRef}
                      InputProps={{
                        disableUnderline: true,
                        style: {
                          overflow: "hidden",
                          background: "transparent",
                        },
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-gray-100">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <Tooltip title="Generate content based on your input" arrow>
                  <Button
                    variant="outlined"
                    onClick={async () => {
                      if (!newNote.content) return;
                      try {
                        setIsGenerating(true);
                        const content = await generateContent(newNote.content);
                        setGeneratedContent(content);
                        setShowGeneratedContent(true);
                      } catch (error) {
                        console.error("Error generating content:", error);
                      } finally {
                        setIsGenerating(false);
                      }
                    }}
                    disabled={isGenerating || !newNote.content}
                    startIcon={<AutoFixHighIcon />}
                    className="text-purple-600 border-purple-200 hover:bg-purple-50 w-full sm:w-auto"
                  >
                    {isGenerating ? "Generating..." : "Generate"}
                  </Button>
                </Tooltip>

                <div className="flex gap-3 w-full sm:w-auto">
                  <Tooltip title="Cancel" arrow>
                    <Button
                      variant="outlined"
                      onClick={handleCloseModal}
                      startIcon={<CancelIcon />}
                      className="hover:bg-red-50 flex-1 sm:flex-none"
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
          </div>

          {/* Generated Content Panel */}
          {showGeneratedContent && (
            <div
              className={`w-full lg:w-[500px] bg-purple-50 rounded-lg transition-all duration-300 flex flex-col h-[80vh] transform ${
                showGeneratedContent
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 translate-x-full"
              }`}
            >
              <div className="p-4 border-b border-purple-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <AutoFixHighIcon className="text-purple-600 mr-2" />
                    <h2 className="text-xl font-semibold text-purple-800">
                      AI Generated
                    </h2>
                  </div>
                  <Tooltip title="Close Panel" arrow placement="top">
                    <IconButton
                      size="small"
                      onClick={() => setShowGeneratedContent(false)}
                      className="hover:rotate-90 transition-transform duration-300"
                    >
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </div>
              </div>

              <div className="flex-1 p-4 overflow-hidden">
                <div className="bg-white p-4 rounded-lg shadow-sm h-full">
                  {isGenerating ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-purple-600">
                        Generating content...
                      </div>
                    </div>
                  ) : (
                    <div className="text-gray-700 whitespace-pre-wrap overflow-y-auto h-full">
                      {generatedContent}
                    </div>
                  )}
                </div>
              </div>

              <div className="p-4 border-t border-purple-100">
                <Button
                  variant="contained"
                  onClick={() => {
                    setNewNote((prev) => ({
                      ...prev,
                      content: generatedContent,
                    }));
                    setShowGeneratedContent(false);
                  }}
                  className="w-full bg-purple-600 hover:bg-purple-700"
                >
                  Use This Content
                </Button>
              </div>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default Dashboard;
