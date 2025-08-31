import React from "react";
import { useNavigate } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import LogoutIcon from "@mui/icons-material/Logout";

interface NavigationProps {
  onCreateNote: () => void;
}

const Navigation: React.FC<NavigationProps> = ({ onCreateNote }) => {
  const navigate = useNavigate();

  const handleSignOut = () => {
    // Remove auth tokens and user data
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    // Redirect to sign in page
    navigate("/signin");
  };

  return (
    <div className="h-full bg-white dark:bg-gray-900">
      <div className="flex items-center space-x-2 p-4 bg-white dark:bg-gray-900">
        <img src="./Logo.png" alt="NotesHive Logo" className="h-10 w-10" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">NotesHive</h3>
      </div>
      <div className="flex space-y-4 p-4 flex-col justify-between h-[calc(100vh-64px)]">
        <div className="space-y-2">
          <button
            className="flex items-center space-x-2 text-gray-700 dark:text-gray-200 hover:text-blue-500 dark:hover:text-blue-400 px-4 py-2 rounded transition duration-200 w-full"
            onClick={() => navigate("/dashboard")}
          >
            <HomeIcon /> <span>Home</span>
          </button>

          <button
            className="flex items-center space-x-2 text-gray-700 dark:text-gray-200 hover:text-blue-500 dark:hover:text-blue-400 px-4 py-2 rounded transition duration-200 w-full"
            onClick={onCreateNote}
          >
            <NoteAddIcon /> <span>Create Note</span>
          </button>
        </div>

        <button
          className="flex items-center space-x-2 text-gray-700 dark:text-gray-200 hover:text-red-500 dark:hover:text-red-400 px-4 py-2 rounded transition duration-200 w-full"
          onClick={handleSignOut}
        >
          <LogoutIcon /> <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
};

export default Navigation;
