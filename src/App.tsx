import MainAside from "./components/sidebars/MainAside.tsx";
import { useAuthStore, useChatStore } from "@/zustand/store.ts";
import { useEffect } from "react";
// import { getAllData } from "./indexDB/indexDB.ts";
import { toast, ToastContainer } from "react-toastify";
import axiosConfig from "./axios/axiosConfig.ts";
// import { AxiosError } from "axios";
import { getAllData } from "./indexDB/indexDB.ts";
import { AxiosError } from "axios";
// import useAuth from "./hooks/useAuth.ts";
import useDeleteData from "./hooks/useDeleteData.ts";

function App() {
  const { activeChatRoom, setChatRooms, setChatsHistory, chatRooms } =
    useChatStore((store) => store);

  const { user, logout } = useAuthStore((store) => store);
  // const { logoutAuth } = useAuth();
  const { deleteChatRoom } = useDeleteData();

  // this useEffect will keeep chaging title
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
        // console.log(data)
        setChatsHistory(data as Chat[]);
      })
      .catch((error) => {
        console.error("Error getting data from indexDB", error);
      });
  }, [setChatRooms, setChatsHistory]);

  useEffect(() => {
    (async function () {
      try {
        if (!user) return;
        const res = await axiosConfig.get("/chat/room");
        console.log("all chat rooms fetch successfully");
        setChatRooms(res.data.chatRooms);
      } catch (error) {
        if (error instanceof AxiosError) {
          toast.error(error.response?.data.message, {
            toastId: "logout failed",
          });
          if (error.response?.data.message === "Access token is required") {
            logout();
            toast.success("User logout successfully!", {
              toastId: "logout successfully",
            });
            // delete all data from indexDB
            await deleteChatRoom({
              chatRoomIds: chatRooms.map((chatRoom) => chatRoom.chatRoomId),
            });
          }
        }
      }
    })();
  }, [user, setChatRooms, chatRooms, deleteChatRoom, logout]);

  return (
    <div>
      {/* <ChatUI /> */}
      <MainAside />
      <ToastContainer />
    </div>
  );
}

export default App;
