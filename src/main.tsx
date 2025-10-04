import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter, Routes, Route } from "react-router";
import LoginPage from "./pages/auth/login.tsx";
import SignupPage from "./pages/auth/Signup.tsx";
import AuthCallback from "./pages/auth/AuthCallback.tsx";
import Models from "./pages/Models.tsx";
import PageLayout from "./pages/PageLayout.tsx";
import MainAside from "./pages/ai-chat/MainAside.tsx";
import ShareChat from "./pages/ShareChat.tsx";
import NotFound from "./pages/error/NotFound.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<MainAside />} />
          <Route path="/c/:chatRoomId" element={<MainAside />} />
          <Route path="/c" element={<MainAside />} />
          <Route path="/auth/login" element={<LoginPage />} />
          <Route path="/auth/signup" element={<SignupPage />} />
          <Route path="/api/auth/google/callback" element={<AuthCallback />} />
          <Route path="/page" element={<PageLayout />}>
            <Route path="/page/models" element={<Models />} />
          </Route>
          {/* share chat route */}
          <Route path="/share" element={<ShareChat />} />
          <Route path="/share/:chatRoomId" element={<MainAside />} />
        </Route>

        {/* error pages */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
