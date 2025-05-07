import MainAside from "./components/sidebars/MainAside.tsx";
import { useChatStore } from "@/zustand/store.ts";
import { useEffect } from "react";

function App() {
  const { activeChatRoom } = useChatStore((store) => store);

  useEffect(() => {
    if (activeChatRoom) {
      document.title = activeChatRoom.chatRoomName;
    } else {
      document.title = "Mind Map";
    }
  }, [activeChatRoom]);

  return (
    <div>
      {/* <ChatUI /> */}
      <MainAside />
    </div>
  );
}

export default App;
