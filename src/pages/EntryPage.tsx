import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/animations.css";
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";

interface EntryPageProps {}

const EntryPage: React.FC<EntryPageProps> = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen w-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 px-4 relative overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-400/10 via-purple-400/10 to-pink-400/10 animate-gradient-x"></div>

      {/* Floating shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-[15%] w-64 h-64 bg-blue-400/10 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
        <div className="absolute top-40 right-[20%] w-72 h-72 bg-purple-400/10 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-32 left-[30%] w-80 h-80 bg-pink-400/10 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
      </div>

      {/* Floating AI Assistant */}
      <div className="absolute top-20 right-[15%] transform hover:scale-105 transition-all duration-300 cursor-pointer animate-float">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl blur-xl"></div>
          <div className="relative bg-white/90 backdrop-blur-sm px-6 py-4 rounded-2xl shadow-lg border border-white/50">
            <div className="flex items-center gap-3">
              <AutoFixHighIcon className="text-purple-500 text-2xl animate-pulse" />
              <div className="text-left">
                <div className="font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">AI Powered</div>
                <div className="text-sm text-gray-500">Smart note suggestions</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Logo and branding */}
      <div className="absolute top-8 left-8 flex items-center gap-3">
        <img
          src="./Logo.png"
          alt="NotesHive Logo"
          className="w-12 h-12 animate-float"
        />
        <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          NotesHive
        </span>
      </div>

      <div className="w-full max-w-lg p-10 bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl text-center flex flex-col items-center relative z-10 border border-white/20">
        <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-blue-500 to-purple-500 p-1 rounded-2xl rotate-3 shadow-lg">
          <div className="bg-white px-6 py-2 rounded-xl">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500 font-semibold">
              Your Digital Notebook
            </span>
          </div>
        </div>

        <h1 className="text-4xl md:text-5xl font-extrabold mb-6 mt-4">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
            Welcome to Notes App
          </span>
        </h1>

        <p className="mb-8 text-gray-600 text-lg leading-relaxed">
          Organize your thoughts, create and manage notes securely.
          <br />
          <span className="text-gray-500">
            Sign up with your email or Google account, and access your notes
            anywhere, anytime.
          </span>
        </p>

        <button
          className="group relative px-8 py-4 w-64 overflow-hidden rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 text-lg font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl active:scale-95"
          onClick={() => navigate("/signin")}
        >
          <span className="relative z-10">Get Started</span>
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
        </button>

        <div className="mt-8 flex items-center gap-4 text-gray-400">
          <div className="h-px w-16 bg-gray-200"></div>
          <span className="text-sm font-medium">Secured with OTP & JWT</span>
          <div className="h-px w-16 bg-gray-200"></div>
        </div>
      </div>

      <footer className="mt-8 text-sm text-gray-400 text-center w-full absolute bottom-4 left-0 z-10">
        &copy; {new Date().getFullYear()} Notes App. All rights reserved.
      </footer>
    </div>
  );
};

export default EntryPage;
