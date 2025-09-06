import { useChatRoomStore } from "@/zustand/store.ts";
import { ToastContainer } from "react-toastify";
import { Outlet } from "react-router";
import { useAuthInit } from "./hooks/useAuth.ts";
import { useChatRoomInit } from "./hooks/useChatRoomInit.ts";
import { useThemeInit } from "./hooks/useTheme.ts";
import { useModelsInit } from "./hooks/useModelsInit.ts";

function App() {
  const { activeChatRoom } = useChatRoomStore((store) => store);

  // init auth
  useAuthInit();
  // init chat data
  useChatRoomInit();
  // init theme
  useThemeInit();
  // init models
  useModelsInit();

  // title will change according to active chat room
  if (activeChatRoom) {
    document.title = activeChatRoom.chatRoomName;
  } else {
    document.title = "Mind Map";
  }

  return (
    <div className="app-container">
      <ToastContainer />
      <Outlet />
    </div>
  );
}

export default App;
