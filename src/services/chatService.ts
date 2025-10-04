import { axiosConfig } from "@/api/axiosConfig";
import IndexedDBService from "@/services/indexDB/indexDBService";

const Idb = new IndexedDBService();

export default class ChatService {
  async getAllChats({ chatRoomId }: { chatRoomId: string }) {
    try {
      const res = await axiosConfig.get(`/chat/${chatRoomId}`);
      if (res.status !== 200) {
        throw new Error("Failed to fetch chats");
      }
      return res.data.data as Chat[];
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : "Unknown error");
    }
  }

  async createChat({
    chat,
    chatCreatedTime,
    user,
  }: {
    chat: Chat;
    chatCreatedTime: number;
    user: User | null;
  }) {
    try {
      await Idb.updateData({
        data: { ...chat, createdAt: chatCreatedTime },
        storeName: "chat",
      });
      if (!user) return;
      const res = await axiosConfig.post(`/chat/create/${chat.chatRoomId}`, {
        fileUrls: JSON.stringify(chat.content[0].fileUrls || []),
        prompt: chat.content[0].content,
        usedModel: chat.content[0].model,
        chatId: chat.chatId,
        role: chat.role,
      });
      if (res.status !== 201) {
        throw new Error("Failed to create chat");
      }
      return res.data.data as Chat;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : "Unknown error");
    }
  }

  async deleteChat(chatRoomId: string) {
    try {
      const res = await axiosConfig.delete(`/chat/all/delete/${chatRoomId}`);
      if (res.status !== 200) {
        throw new Error("unable to delete chats");
      }
      return res.data.data.deletedCount;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : "Unknown error");
    }
  }
}

// singleton instance
export const chatService = new ChatService();
