import React, { useState } from "react";
import "./App.css";
import EntryPage from "./pages/EntryPage";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Dashboard from "./pages/Dashboard";

function App() {


  return (
    <Router>
      <Routes>
        <Route path="/" element={<EntryPage />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;



