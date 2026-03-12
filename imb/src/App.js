import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Layout from "./components/Layout";
import Body from "./components/Body";
import Application from "./pages/Application";
import OTP from "./pages/OTP";
import Tell from "./pages/Tell";
import Where from "./pages/Where";
import Contact from "./pages/Contact";
import Upload from "./pages/Upload";
import Thank from "./pages/Thank";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Body />} />
          <Route path="/login" element={<Login />} />
          <Route path="/apply" element={<Application />} />
          <Route path="/otp" element={<OTP />} />
          <Route path="/tell" element={<Tell />} />
          <Route path="/where" element={<Where />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/thank" element={<Thank />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
