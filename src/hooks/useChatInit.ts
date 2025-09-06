import { ChatService } from "@/services/chatService";
import IndexedDBService from "@/services/indexDB/indexDBService";
import { useAuthStore } from "@/zustand/store";
import { useEffect, useCallback } from "react";
import { useParams } from "react-router";
import { toast } from "react-toastify";

const chatService = new ChatService();
const Idb = new IndexedDBService();

export const useChatInit = ({
  setCurrentChatsHistory,
}: {
  setCurrentChatsHistory: ChatStoreState["setCurrentChatsHistory"];
}) => {
  const { user } = useAuthStore((store) => store);
  const params = useParams();

  const getChatData = useCallback(async () => {
    try {
      const { chatRoomId } = params;
      if (!chatRoomId) return;
      if (!user) {
        // fetch user data from indexDB
        const chats = await Idb.getChatsByChatRoomId(chatRoomId);
        setCurrentChatsHistory(chats);
      } else {
        // fetch user data from mongoDB
        const chatData = await chatService.getAllChats({ chatRoomId });
        setCurrentChatsHistory(chatData);
      }
    } catch (error) {
      console.error("Error fetching chat data:", error);
      toast.error("Error while fetching chat data", {
        toastId: "chat-fetch-error",
      });
    }
  }, [params, user]);

  useEffect(() => {
    getChatData();
  }, [getChatData]);
};
