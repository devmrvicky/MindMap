import { axiosConfig } from "@/api/axiosConfig";
import IndexedDBService from "./indexDB/indexDBService";
import { ChatService } from "./chatService";
import { toast } from "react-toastify";

const Idb = new IndexedDBService();
const chatService = new ChatService();

export class ChatRoomService {
  async getChatRoomsFromDB() {
    try {
      const res = await axiosConfig.get("/chat/room");
      if (res.status !== 200) {
        throw new Error("Failed to fetch chat rooms");
      }
      return res.data.chatRooms;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : "Unknown error");
    }
  }

  async createChatRoomInDB({
    newChatRoom,
    user,
  }: {
    newChatRoom: ChatRoom;
    user: User | null;
  }) {
    try {
      await Idb.updateData({ storeName: "chatRoom", data: newChatRoom });
      if (!user) return;
      const res = await axiosConfig.post("/chat/room/create", newChatRoom);
      if (res.status !== 201) {
        throw new Error("Failed to create new chat room");
      }
      return res.data.chatRoom;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : "Unknown error");
    }
  }

  async deleteChatRoomFromDB({
    chatRoomId,
  }: {
    chatRoomId: ChatRoom["chatRoomId"];
  }) {
    try {
      const [chatRoomDeleteRes, totalDeletedChats] = await Promise.all([
        axiosConfig.delete(`/chat/room/delete/${chatRoomId}`),
        chatService.deleteChat(chatRoomId),
      ]);
      if (chatRoomDeleteRes.status !== 200 && totalDeletedChats) {
        throw new Error("Failed to delete chat room");
      }
      toast.success(totalDeletedChats + " chats deleted successfully.");
      return chatRoomDeleteRes.data.deletedChatRoom;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : "Unknown error");
    }
  }
}
