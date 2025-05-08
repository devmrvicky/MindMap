import MainAside from "./components/sidebars/MainAside.tsx";
import { useChatStore } from "@/zustand/store.ts";
import { useEffect } from "react";
import { getAllData } from "./indexDB/indexDB.ts";

function App() {
  const { activeChatRoom, setChatRooms, setChatsHistory } = useChatStore((store) => store);

  useEffect(() => {
    if (activeChatRoom) {
      document.title = activeChatRoom.chatRoomName;
    } else {
      document.title = "Mind Map";
    }
  }, [activeChatRoom]);

  useEffect(() => {
    // get all chat rooms from indexDB
    getAllData({
      storeName: "chatRoom",
    })
      .then((data) => {
        // set chat rooms to the store
        setChatRooms(data as ChatRoom[]);
      })
      .catch((error) => {
        console.error("Error getting data from indexDB", error);
      });
    // get all chats from indexDB
    getAllData({
      storeName: "chat",
    })
      .then((data) => {
        // set chat rooms to the store
        setChatsHistory(data as Chat[]);
      })
      .catch((error) => {
        console.error("Error getting data from indexDB", error);
      });
    
  }, [setChatRooms, setChatsHistory])

  return (
    <div>
      {/* <ChatUI /> */}
      <MainAside />
    </div>
  );
}

export default App;
