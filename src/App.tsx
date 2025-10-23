import { useChatRoomStore } from "@/zustand/store.ts";
import { Outlet } from "react-router";
import { useEffect } from "react";
import { useAppInit } from "./hooks/useAppInit";
import { Toaster } from "react-hot-toast";

function App() {
  const chatRoomName = useChatRoomStore((s) => s.activeChatRoom?.chatRoomName);

  // initialize everything in one place
  useAppInit();

  // update document title only when chatRoomName changes
  useEffect(() => {
    document.title = chatRoomName || "Mind Map";
  }, [chatRoomName]);

  return (
    <div className="app-container">
      <Toaster />
      <Outlet />
    </div>
  );
}

export default App;
