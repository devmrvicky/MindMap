export {};

declare global {
  interface Chat {
    id: string;
    role: "user" | "assistant";
    content: string;
    chatRoomId: string;
  }

  interface Model {
    name: string;
    model: string;
    label: "free" | "paid";
  }

  interface StoreState {
    chatsHistory: Chat[];
    setChatsHistory: (chats: Chat[]) => void;
    addNewChat: (newChat: Chat) => void;
    currentChatsHistory: Chat[];
    setCurrentChatsHistory: (chats: Chat[]) => void;
    isResponseLoading: boolean;
    setIsResponseLoading: (isLoading: boolean) => void;
    LLMResponsedError: string;
    models: Model[];
    setLLMResponsedError: (error: string) => void;
    currentLLMModel: string;
    changeCurrentLLMModel: (model: string) => void;
    chatRooms: ChatRoom[];
    setChatRooms: (chatRooms: ChatRoom[]) => void;
    activeChatRoom: ActiveChatRoom;
    setActiveChatRoom: (chatRoom: ActiveChatRoom) => void;
    createNewChatRoom: (newChatRoom: ChatRoom) => void;
  }

  interface Chats {
    id: string;
    chatsHistory: Chat[];
  }

  // chat room
  interface ChatRoom {
    id: string;
    chatRoomName: string;
  }

  type ActiveChatRoom = ChatRoom | null;

  type storeName = "chat" | "chatRoom";
  type Data = Chat | ChatRoom;
}
