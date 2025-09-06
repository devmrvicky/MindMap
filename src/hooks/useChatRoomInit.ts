import { useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import { axiosConfig } from "@/api/axiosConfig";
import IndexedDBService from "@/services/indexDB/indexDBService";
import {
  useChatStore,
  useAuthStore,
  useChatRoomStore,
} from "@/zustand/store.ts";
import { AxiosError } from "axios";

const Idb = new IndexedDBService();

export function useChatRoomInit() {
  const { setChatsHistory } = useChatStore((store) => store);
  const { setChatRooms, setIsChatRoomsFetching } = useChatRoomStore(
    (store) => store
  );
  const { user } = useAuthStore((store) => store);

  const loadChatData = useCallback(async () => {
    try {
      setIsChatRoomsFetching(true);
      let chatRooms: ChatRoom[] = [];
      // let chats: Chat[] = [];

      if (!user) {
        // fetch from indexDB if user not logged in
        // const [rooms, history] = await Promise.all([
        //   getAllData({ storeName: "chatRoom" }),
        //   getAllData({ storeName: "chat" }),
        // ]);
        const rooms = await Idb.getAllData({ storeName: "chatRoom" });
        chatRooms = rooms as ChatRoom[];
        // chats = history as Chat[];
      } else {
        // clear indexDB and fetch from server
        await Promise.all([Idb.clearStore("chatRoom"), Idb.clearStore("chat")]);
        const { data } = await axiosConfig.get("/chat/room");
        chatRooms = data.chatRooms;
        Idb.setAllData({ data: chatRooms, storeName: "chatRoom" });
      }

      setChatRooms(chatRooms);
      // setChatsHistory(chats);
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(
          error.response?.data.message || "Failed to fetch chat data",
          {
            toastId: "chat-fetch-error",
          }
        );
      } else {
        console.error("Unexpected chat fetch error:", error);
      }
    } finally {
      setIsChatRoomsFetching(false);
    }
  }, [user, setChatRooms, setChatsHistory, setIsChatRoomsFetching]);

  useEffect(() => {
    loadChatData();
  }, [loadChatData]);
}
