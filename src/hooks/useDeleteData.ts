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

// import axiosConfig from "@/axios/axiosConfig";
import axiosConfig from "@/axios/axiosConfig";
import { deleteData } from "@/indexDB/indexDB";
import { useAuthStore, useChatStore } from "@/zustand/store";
import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { toast } from "react-toastify";

const useDeleteData = () => {
  const [deleting, setDeleting] = useState(false);
  const { deleteChatRoomFromLocal, chatsHistory, setCurrentChatsHistory } =
    useChatStore((store) => store);

  const { user } = useAuthStore((store) => store);

  const param = useParams();

  const navigate = useNavigate();

  const deleteChatRoom = async ({ chatRoomIds }: { chatRoomIds: string[] }) => {
    // if user is logged in then delete chat room from mongoDB first then delete it from indexDB
    setDeleting(true);
    if (user) {
      try {
        // delete chat room from mongoDB
        await axiosConfig.delete(`/chat/room/delete/${chatRoomIds[0]}`);
        // delete chats of this chat room from mongoDB
        const res = await axiosConfig.delete(
          `/chat/all/delete/${chatRoomIds[0]}`
        );
        toast.success(res.data.deletedCount + " chats deleted successfully.");
        console.log("deleting chat room from mongoDB");
      } catch (error) {
        console.error("Error deleting chat room from MongoDB:", error);
      } finally {
        setDeleting(false);
      }
    }
    // await axiosConfig.delete("/")
    // delete data from indexDB
    chatRoomIds.forEach(async (chatRoomId) => {
      // delete chat room from indexDB
      deleteData({ id: chatRoomId, storeName: "chatRoom" });
      // delete chat room from mongoDB
      console.log("chat history from delete chat room hook ", chatsHistory);
      chatsHistory
        .filter((chat) => chat.chatRoomId === chatRoomId)
        .forEach((filteredChat) => {
          deleteData({ id: filteredChat.chatId, storeName: "chat" });
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
