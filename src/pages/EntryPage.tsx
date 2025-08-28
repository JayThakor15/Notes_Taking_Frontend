import React from "react";
import { useNavigate } from "react-router-dom";

interface EntryPageProps {}

const EntryPage: React.FC<EntryPageProps> = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen w-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100 px-4 relative overflow-hidden">
      {/* Decorative background images */}
      <img
        src="/src/assets/react.svg"
        alt="React Logo"
        className="absolute top-8 left-8 w-16 h-16 opacity-30 animate-spin-slow"
      />
      <img
        src="/public/vite.svg"
        alt="Vite Logo"
        className="absolute bottom-8 right-8 w-20 h-20 opacity-20"
      />
      <img
        src="https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=400&q=80"
        alt="Notes"
        className="absolute top-1/2 left-0 transform -translate-y-1/2 w-32 h-32 rounded-full opacity-10"
      />
      <img
        src="https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=400&q=80"
        alt="Cloud"
        className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-40 h-24 opacity-10"
      />
      <div className="w-full max-w-lg p-8 bg-white rounded-2xl shadow-lg text-center flex flex-col items-center relative z-10">
        <h1 className="text-3xl md:text-4xl font-extrabold mb-4 text-blue-600 drop-shadow-lg">
          Welcome to <span className="text-purple-500">Notes App</span>
        </h1>
        <p className="mb-6 text-gray-700 text-base md:text-lg">
          Organize your thoughts, create and manage notes securely.
          <br />
          Sign up with your email or Google account, and access your notes
          anywhere, anytime.
          <br />
          Your data is protected with OTP and JWT authentication.
        </p>
        <button
          className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-8 py-3 rounded-full text-lg font-semibold shadow-lg transition w-full md:w-auto"
          onClick={() => navigate("/signin")}
        >
          Get Started
        </button>
      </div>
      <footer className="mt-8 text-xs text-gray-500 text-center w-full absolute bottom-2 left-0 z-10">
        &copy; {new Date().getFullYear()} Notes App. All rights reserved.
      </footer>
    </div>
  );
};

export default EntryPage;
