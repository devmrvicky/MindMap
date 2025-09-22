import { useEffect } from "react";
import { toast } from "react-toastify";
import { axiosConfig } from "@/api/axiosConfig";
import { Idb } from "@/services/indexDB/indexDBService"; // export singleton
import {
  useChatStore,
  useAuthStore,
  useChatRoomStore,
} from "@/zustand/store.ts";
import { AxiosError } from "axios";

export function useChatRoomInit() {
  const setChatsHistory = useChatStore((s) => s.setChatsHistory);
  const setChatRooms = useChatRoomStore((s) => s.setChatRooms);
  const setIsChatRoomsFetching = useChatRoomStore(
    (s) => s.setIsChatRoomsFetching
  );
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    const loadChatData = async () => {
      try {
        setIsChatRoomsFetching(true);
        let chatRooms: ChatRoom[] = [];

        if (!user) {
          // fetch from indexDB if user not logged in
          const rooms = await Idb.getAllData({ storeName: "chatRoom" });
          chatRooms = rooms as ChatRoom[];
        } else {
          // clear indexDB and fetch from server
          await Promise.all([
            Idb.clearStore("chatRoom"),
            Idb.clearStore("chat"),
          ]);
          const res = await axiosConfig.get("/chatroom");
          chatRooms = res.data.data;
          await Idb.setAllData({ data: chatRooms, storeName: "chatRoom" });
        }

        setChatRooms(chatRooms);
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
    };

    loadChatData();
  }, [user, setChatRooms, setIsChatRoomsFetching, setChatsHistory]);
}
