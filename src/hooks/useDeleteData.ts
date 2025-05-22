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

import { deleteData } from "@/indexDB/indexDB";
import { useChatStore } from "@/zustand/store";

const useDeleteData = () => {
  const { deleteChatRoomFromLocal, chatsHistory } = useChatStore(
    (store) => store
  );

  const deleteChatRoom = async ({ chatRoomIds }: { chatRoomIds: string[] }) => {
    // delete data from indexDB
    chatRoomIds.forEach((chatRoomId) => {
      deleteData({ id: chatRoomId, storeName: "chatRoom" });
      chatsHistory
        .filter((chat) => chat.chatRoomId === chatRoomId)
        .forEach((filteredChat) => {
          deleteData({ id: filteredChat.id, storeName: "chat" });
        });
      // delete chat room from zustand store
      deleteChatRoomFromLocal(chatRoomId);
    });
    // delete all chats which belong to this chat room
    // chatsHistory.forEach((chathistory) => {

    //   deleteData({ id: chathistory.id, storeName: "chat" });
    // });
  };

  return { deleteChatRoom };
};

export default useDeleteData;
