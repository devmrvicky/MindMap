import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter, Routes, Route } from "react-router";
import LoginPage from "./pages/auth/login.tsx";
import SignupPage from "./pages/auth/Signup.tsx";
import AuthCallback from "./pages/auth/AuthCallback.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/c/:chatRoomId" element={<App />} />
        <Route path="/c" element={<App />} />
        <Route path="/auth/login" element={<LoginPage />} />
        <Route path="/auth/signup" element={<SignupPage />} />
        <Route path="/api/auth/google/callback" element={<AuthCallback />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
