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
import { deleteData } from "@/indexDB/indexDB";
import { useChatStore } from "@/zustand/store";
import { useNavigate, useParams } from "react-router";

const useDeleteData = () => {
  const { deleteChatRoomFromLocal, chatsHistory, setCurrentChatsHistory } =
    useChatStore((store) => store);

  const param = useParams();

  const navigate = useNavigate();

  const deleteChatRoom = async ({ chatRoomIds }: { chatRoomIds: string[] }) => {
    // delete data from indexDB
    chatRoomIds.forEach(async (chatRoomId) => {
      // delete chat room from indexDB
      deleteData({ id: chatRoomId, storeName: "chatRoom" });
      // delete chat room from mongoDB
      // await axiosConfig.delete("/")
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
    // delete all chats which belong to this chat room
    // chatsHistory.forEach((chathistory) => {

    //   deleteData({ id: chathistory.id, storeName: "chat" });
    // });
    // navigate("/");
  };

  return { deleteChatRoom };
};

export default useDeleteData;
