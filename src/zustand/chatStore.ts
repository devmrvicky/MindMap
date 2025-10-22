import { create } from "zustand";

const useChatStore = create<ChatStoreState>((set) => ({
  chatsHistory: [],
  currentChatsHistory: [],
  setChatsHistory: (chats: Chat[]) =>
    set(() => ({
      chatsHistory: chats,
    })),
  addNewChat: (newChat: Chat) =>
    set((state) => ({
      currentChatsHistory: [...state.currentChatsHistory, newChat],
      chatsHistory: [...state.chatsHistory, newChat],
    })),
  updateChat: (updatedChat: {
    chatId: string;
    content: string;
    model: string;
  }) =>
    set((state) => {
      const targetChat = state.currentChatsHistory.find(
        (chat) => chat.chatId === updatedChat.chatId
      );
      targetChat?.content.push({
        content: updatedChat.content,
        type: "text",
        model: updatedChat.model,
      });
      return {
        currentChatsHistory: state.currentChatsHistory.map((chat) =>
          chat.chatId === updatedChat.chatId
            ? { ...chat, content: targetChat?.content || [] }
            : chat
        ),
        // chatsHistory: state.chatsHistory.map(chat =>
        //   chat.chatId === updatedChat.chatId ? { ...chat, content: targetChat?.content || [] } : chat
        // ),
      };
    }),
  setCurrentChatsHistory: (chats: Chat[]) =>
    set(() => ({
      currentChatsHistory: chats,
    })),
}));

export default useChatStore;
