import { create } from "zustand";

const useChatRoomStore = create<ChatRoomStoreState>((set) => ({
  chatRooms: [],
  activeChatRoom: null,
  isChatRoomActive: false,
  isChatRoomsFetching: false,
  setChatRooms: (chatRooms: ChatRoom[]) =>
    set(() => ({ chatRooms: chatRooms })),
  setActiveChatRoom: (chatRoom: ActiveChatRoom) =>
    set(() => {
      // console.log("from store", chatRoom);
      return { activeChatRoom: chatRoom };
    }),
  createNewChatRoomOnLocal: (newChatRoom: ChatRoom) =>
    set((state) => {
      // console.log("creating new chat room", newChatRoom);
      return {
        isChatRoomActive: true,
        activeChatRoom: newChatRoom,
        chatRooms: [...state.chatRooms, newChatRoom],
      };
    }),
  deleteChatRoomFromLocal: (id: string, isActiveChatRoom: boolean) =>
    set((state) => ({
      chatRooms: state.chatRooms.filter(
        (chatRoom) => chatRoom.chatRoomId !== id
      ),
      // chatsHistory: state.chatsHistory.filter((chat) => chat.chatRoomId !== id),
      // currentChatsHistory: isActiveChatRoom ? [] : state.currentChatsHistory,
      activeChatRoom: isActiveChatRoom ? null : state.activeChatRoom,
    })),
  setIsChatRoomsFetching: (isFetching: boolean) =>
    set(() => ({
      isChatRoomsFetching: isFetching,
    })),
}));

export default useChatRoomStore;
