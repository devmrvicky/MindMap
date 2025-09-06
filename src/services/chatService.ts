import { axiosConfig } from "@/api/axiosConfig";
import IndexedDBService from "@/services/indexDB/indexDBService";

const Idb = new IndexedDBService();

export class ChatService {
  async getAllChats({ chatRoomId }: { chatRoomId: string }) {
    try {
      const res = await axiosConfig.get(`/chat/${chatRoomId}`);
      if (res.status !== 200) {
        throw new Error("Failed to fetch chats");
      }
      return res.data.chats;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : "Unknown error");
    }
  }

  async createChat({ chat, user }: { chat: Chat; user: User | null }) {
    try {
      await Idb.updateData({ data: chat, storeName: "chat" });
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
      return res.data.chat;
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
      return res.data.deletedCount;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : "Unknown error");
    }
  }
}
