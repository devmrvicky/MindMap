/**
 * A custom hook responsible for managing the deletion of data within the application.
 * This includes deleting entities such as "Chat rooms" and "Chats".
 *
 * The hook performs the following tasks:
 * - Deletes data in the local IndexedDB for offline storage and synchronization.
 * - Deletes data in the MongoDB database for persistent storage.
 * - Deletes the Zustand store to reflect changes in the chat UI in real-time.
 *
 * This ensures seamless data management and synchronization across the application.
 */

import { useAuthStore, useChatRoomStore, useChatStore } from "@/zustand/store";
import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { toast } from "react-toastify";
import { ChatRoomService } from "@/services/chatRoomService";
import IndexedDBService from "@/services/indexDB/indexDBService";

const chatRoom = new ChatRoomService();
const Idb = new IndexedDBService();

const useDeleteData = () => {
  const [deleting, setDeleting] = useState(false);
  const { chatsHistory, setCurrentChatsHistory } = useChatStore(
    (store) => store
  );
  const { deleteChatRoomFromLocal } = useChatRoomStore((store) => store);

  const { user } = useAuthStore((store) => store);

  const param = useParams();

  const navigate = useNavigate();

  const deleteChatRoom = async ({ chatRoomIds }: { chatRoomIds: string[] }) => {
    // if user is logged in then delete chat room from mongoDB first then delete it from indexDB
    setDeleting(true);
    if (user) {
      try {
        // delete chat room from mongoDB
        await chatRoom.deleteChatRoomFromDB({ chatRoomId: chatRoomIds[0] });
      } catch (error) {
        console.error("Error deleting chat room from MongoDB:", error);
        toast.error("Error while deleting chats", {
          toastId: "chatroom-delete-error",
        });
        return;
      } finally {
        setDeleting(false);
      }
    }
    // await axiosConfig.delete("/")
    // delete data from indexDB
    chatRoomIds.forEach(async (chatRoomId) => {
      // delete chat room from indexDB
      await Idb.deleteData({ id: chatRoomId, storeName: "chatRoom" });
      // delete chat room from mongoDB
      console.log("chat history from delete chat room hook ", chatsHistory);
      chatsHistory
        .filter((chat) => chat.chatRoomId === chatRoomId)
        .forEach(async (filteredChat) => {
          await Idb.deleteData({ id: filteredChat.chatId, storeName: "chat" });
        });
      // delete chat room from zustand store
      deleteChatRoomFromLocal(chatRoomId, param.chatRoomId === chatRoomId);
      if (param.chatRoomId === chatRoomId) {
        console.log("it matched.");
        navigate("/");
        setCurrentChatsHistory([]);
      }
    });
    setDeleting(false);
  };

  return { deleteChatRoom, deleting };
};

export default useDeleteData;
