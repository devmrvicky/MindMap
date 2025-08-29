import { useAuthStore, useChatStore, useThemeStore } from "@/zustand/store.ts";
import { useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import axiosConfig from "./axios/axiosConfig.ts";
import { clearStore, getAllData, setAllData } from "./indexDB/indexDB.ts";
import { AxiosError } from "axios";
import { Outlet } from "react-router";

function App() {
  const {
    activeChatRoom,
    setChatRooms,
    setChatsHistory,
    setIsChatRoomsFetching,
    setChatModels,
  } = useChatStore((store) => store);

  const { user, login, logout } = useAuthStore((store) => store);

  const { setDarkMode } = useThemeStore((store) => store);

  useEffect(() => {
    (async function () {
      try {
        const response = await axiosConfig.get("/user");
        if (response && response.data.user) {
          // login
          login(response.data.user);
        } else {
          // logout
          logout();
        }
      } catch (error) {
        logout();
        console.error(error);
      }
    })();
  }, [login, logout]);

  // get chat room and chats if user logged in
  useEffect(() => {
    (async function () {
      try {
        setIsChatRoomsFetching(true);
        let chatRooms: ChatRoom[];
        let chats: Chat[] = [];
        if (!user) {
          // if user not logged in fetch data from indexDB
          const data = await Promise.all([
            getAllData({ storeName: "chatRoom" }),
            getAllData({ storeName: "chat" }),
          ]);
          chatRooms = data[0] as ChatRoom[];
          chats = data[1] as Chat[];
          console.log(chatRooms);
          // return;
        } else {
          // delete all indexDB data (chats and chat rooms) before fatching data from database
          clearStore("chatRoom");
          clearStore("chat");
          const res = await axiosConfig.get("/chat/room");
          console.log("all chat rooms fetch successfully");
          chatRooms = res.data.chatRooms;
          setAllData({ data: chatRooms, storeName: "chatRoom" });
        }
        setChatRooms(chatRooms);
        setChatsHistory(chats as Chat[]);
      } catch (error) {
        if (error instanceof AxiosError) {
          toast.error(error.response?.data.message, {
            toastId: "logout failed",
          });
        }
      } finally {
        setIsChatRoomsFetching(false);
      }
    })();
  }, [setChatRooms, user, setChatsHistory, setIsChatRoomsFetching]);

  // this useEffect will keeep chaging title
  useEffect(() => {
    if (activeChatRoom) {
      document.title = activeChatRoom.chatRoomName;
    } else {
      document.title = "Mind Map";
    }
  }, [activeChatRoom]);

  // check system theme
  useEffect(() => {
    const isDarkMode = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    console.log("isDarkMode: ", isDarkMode);
    setDarkMode(isDarkMode);
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  // new useEffect for getting model from indexDB and update model store
  useEffect(() => {
    (async () => {
      const models = (await getAllData({
        storeName: "currentlyUsedModels",
      })) as Partial<Model>[];
      console.log(models);
      setChatModels(models);
    })();
  }, []);

  return (
    <div>
      <ToastContainer />
      <Outlet />
    </div>
  );
}

export default App;
