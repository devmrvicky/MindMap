import { axiosConfig } from "@/api/axiosConfig";
import { Idb } from "./indexDB/indexDBService";
import { chatService } from "./chatService";
import { successToast } from "./toastService/toastService";

export default class ChatRoomService {
  async getChatRoomsFromDB() {
    try {
      const res = await axiosConfig.get("/chatroom");
      if (res.status !== 200) {
        throw new Error("Failed to fetch chat rooms");
      }
      return res.data.data;
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
      const res = await axiosConfig.post("/chatroom/create", newChatRoom);
      if (res.status !== 201) {
        throw new Error("Failed to create new chat room");
      }
      return res.data.data;
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
        axiosConfig.delete(`/chatroom/delete/${chatRoomId}`),
        chatService.deleteChat(chatRoomId),
      ]);
      if (chatRoomDeleteRes.status !== 200 && totalDeletedChats) {
        throw new Error("Failed to delete chat room");
      }
      successToast(totalDeletedChats + " chats deleted successfully.");
      return chatRoomDeleteRes.data.data;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : "Unknown error");
    }
  }

  async getSharedChatRoom({ chatRoomId }: { chatRoomId: string }) {
    try {
      const res = await axiosConfig.get(`/chatroom/shared/${chatRoomId}`);
      if (res.status === 404) {
        console.error(res.data.message);
        return [];
      }
      if (res.status !== 200) {
        throw new Error(res.data.message);
      }
      return res.data.data as Chat[];
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : "Unknown error");
    }
  }

  async createSharedChatRoom({ chatRoomId }: { chatRoomId: string }) {
    try {
      const res = await axiosConfig.post("chatroom/shared/create", {
        chatRoomId,
      });
      if (res.status !== 201) {
        throw new Error(res.data.message);
      }
      return res.data.data;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : "Unknown error");
    }
  }

  async deleteSharedChatRoom({ chatRoomId }: { chatRoomId: string }) {
    try {
      const res = await axiosConfig.delete(
        `chatroom/shared/delete/${chatRoomId}`
      );
      if (res.status !== 200) {
        throw new Error(res.data.message);
      }
      return res.data.data;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : "Unknown error");
    }
  }
}

export const chatRoomService = new ChatRoomService();
