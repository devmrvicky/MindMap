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
import { chatRoomService } from "@/services/chatRoomService";
import { Idb } from "@/services/indexDB/indexDBService";

const useDeleteData = () => {
  const [deleting, setDeleting] = useState(false);
  const currentChatsHistory = useChatStore(
    (store) => store.currentChatsHistory
  );
  const setCurrentChatsHistory = useChatStore(
    (store) => store.setCurrentChatsHistory
  );
  const deleteChatRoomFromLocal = useChatRoomStore(
    (store) => store.deleteChatRoomFromLocal
  );

  const user = useAuthStore((store) => store.user);

  const { chatRoomId } = useParams();

  const navigate = useNavigate();

  const deleteChatRoom = async ({
    chatRoomIds,
    isLoggingOut,
  }: {
    chatRoomIds: string[];
    isLoggingOut?: boolean;
  }) => {
    // if user is logged in then delete chat room from mongoDB first then delete it from indexDB
    setDeleting(true);
    if (user && !isLoggingOut && chatRoomIds.length === 1) {
      try {
        // delete chat room from mongoDB
        await chatRoomService.deleteChatRoomFromDB({
          chatRoomId: chatRoomIds[0],
        });
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

    try {
      const deletePromises = chatRoomIds.map(async (roomId) => {
        await Idb.deleteData({ id: roomId, storeName: "chatRoom" });
        currentChatsHistory.forEach(async (chat) => {
          await Idb.deleteData({ id: chat.chatId, storeName: "chat" });
        });
        deleteChatRoomFromLocal(roomId, roomId === chatRoomId);
        if (roomId === chatRoomId) {
          navigate("/");
          setCurrentChatsHistory([]);
        }
      });

      await Promise.all(deletePromises);
    } catch (error) {
      console.error("Error deleting chat room:", error);
      toast.error("Error while deleting chats", {
        toastId: "chatroom-delete-error",
      });
    } finally {
      setDeleting(false);
    }
  };

  return { deleteChatRoom, deleting };
};

export default useDeleteData;
