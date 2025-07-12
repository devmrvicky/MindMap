export {};

declare global {
  interface Chat {
    chatId: string;
    role: "user" | "assistant";
    content: {
      content: string;
      type: "text" | "image";
      model: string;
    }[];
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
    updateChat: (updatedChat: {
      chatId: string;
      content: string;
      model: string;
    }) => void;
    currentChatsHistory: Chat[];
    setCurrentChatsHistory: (chats: Chat[]) => void;
    isResponseLoading: boolean;
    setIsResponseLoading: (isLoading: boolean) => void;
    LLMResponsedError: string;
    chatModels: Model[];
    imageModels: Model[];
    setLLMResponsedError: (error: string) => void;
    currentLLMModel: string;
    changeCurrentLLMModel: (model: string) => void;
    chatRooms: ChatRoom[];
    setChatRooms: (chatRooms: ChatRoom[]) => void;
    activeChatRoom: ActiveChatRoom;
    setActiveChatRoom: (chatRoom: ActiveChatRoom) => void;
    createNewChatRoomOnLocal: (newChatRoom: ChatRoom) => void;
    deleteChatRoomFromLocal: (id: string, isActiveChatRoom: boolean) => void;
    isChatRoomsFetching: boolean;
    setIsChatRoomsFetching: (isFetching: boolean) => void;
  }

  interface Chats {
    id: string;
    chatsHistory: Chat[];
  }

  // chat room
  interface ChatRoom {
    chatRoomId: string;
    chatRoomName: string;
    userId: string;
  }

  type ActiveChatRoom = ChatRoom | null;

  type storeName = "chat" | "chatRoom";
  type Data = Chat | ChatRoom;

  // user store types
  // interface UserStoreState {
  //   user: User | null;
  //   // setUser: (user: User) => void;
  //   isLoggedIn: boolean;
  //   login: (user: User | null) => void;
  //   logout: () => void;
  //   canUseWithoutAuth: boolean;
  //   setCanUseWithoutAuth: (canUse: boolean) => void;
  // }

  interface AuthStoreState {
    user: User | null;
    isLoggedIn: boolean;
    login: (user: User | null) => void;
    logout: () => void;
    canUseWithoutAuth: boolean;
    setCanUseWithoutAuth: (canUse: boolean) => void;
  }

  interface User {
    _id: string; // MongoDB document ID
    name: string;
    email: string;
    authType: "google" | "github" | "email";
    profilePic: string;
    password: string;
  }

  interface ImageStoreState {
    imageGenerationOn: boolean;
    generatedImages: string[];
    setGeneratedImages: (images: string[]) => void;
    addGeneratedImage: (image: string) => void;
    clearGeneratedImages: () => void;
    setImageGenerationOn: (on: boolean) => void;
    isImageGenerating: boolean;
    setIsImageGenerating: (isGenerating: boolean) => void;
    imageGenerationError: string;
    setImageGenerationError: (error: string) => void;
  }

  interface ThemeStoreState {
    isDarkMode: boolean;
    setDarkMode: (isDark: boolean) => void;
  }
}
