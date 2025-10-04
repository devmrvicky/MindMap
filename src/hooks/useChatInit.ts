import { chatRoomService } from "@/services/chatRoomService";
import { chatService } from "@/services/chatService";
import { Idb } from "@/services/indexDB/indexDBService";
import { useAuthStore, useModelStore } from "@/zustand/store";
import { useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router";
import { toast } from "react-toastify";

export const useChatInit = ({
  isSharedChatRoom,
  setCurrentChatsHistory,
}: {
  setCurrentChatsHistory: ChatStoreState["setCurrentChatsHistory"];
  isSharedChatRoom?: boolean;
}) => {
  const user = useAuthStore((s) => s.user);
  const isResponseLoading = useModelStore((state) => state.isResponseLoading);
  const { chatRoomId } = useParams();
  const navigate = useNavigate();

  const getChatData = useCallback(async () => {
    if (isResponseLoading) return; // prevent chat initialization if a response is loading
    if (!chatRoomId) {
      navigate("/");
      setCurrentChatsHistory([]); // optional: remove if reset is not needed
      return;
    }

    try {
      if (isSharedChatRoom) {
        const chatData = await chatRoomService.getSharedChatRoom({
          chatRoomId,
        });

        if (chatData.length === 0) {
          navigate("/");
          return;
        }
        setCurrentChatsHistory(chatData);
        // also set data into indexDB database
        await Idb.setAllData({ storeName: "chat", data: chatData });
        // delete shared chat room after fetching
        // await chatRoomService.deleteSharedChatRoom({ chatRoomId });
      } else {
        if (!user) {
          // fetch from indexDB
          const chats = await Idb.getChatsByChatRoomId(chatRoomId);
          setCurrentChatsHistory(chats);
        } else {
          // fetch from backend
          const chatData = await chatService.getAllChats({ chatRoomId });
          setCurrentChatsHistory(chatData);
        }
      }
    } catch (error) {
      console.error("Error fetching chat data:", error);
      toast.error("Failed to fetch chat data", { toastId: "chat-fetch-error" });
    }
  }, [chatRoomId, user, navigate, setCurrentChatsHistory]);

  useEffect(() => {
    getChatData();
  }, [getChatData]);
};
