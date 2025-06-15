import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const useChatStore = create<StoreState>((set) => ({
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
  setCurrentChatsHistory: (chats: Chat[]) =>
    set(() => ({
      currentChatsHistory: chats,
    })),

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
      chatsHistory: state.chatsHistory.filter((chat) => chat.chatRoomId !== id),
      currentChatsHistory: isActiveChatRoom ? [] : state.currentChatsHistory,
      activeChatRoom: isActiveChatRoom ? null : state.activeChatRoom,
    })),
  setIsChatRoomsFetching: (isFetching: boolean) =>
    set(() => ({
      isChatRoomsFetching: isFetching,
    })),

  isResponseLoading: false,
  setIsResponseLoading: (isLoading: boolean) =>
    set(() => ({
      isResponseLoading: isLoading,
    })),

  // llm error
  LLMResponsedError: "",
  setLLMResponsedError: (error: string) =>
    set(() => ({
      LLMResponsedError: error,
    })),

  // current llm model
  models: [
    {
      name: "Mistral 7B",
      model: "mistralai/mistral-small-3.1-24b-instruct:free",
      label: "free",
    },
    {
      name: "Gemini 2.5 Pro",
      model: "google/gemini-2.5-pro-exp-03-25:free",
      label: "free",
    },

    {
      name: "DeepSeek Base",
      model: "deepseek/deepseek-v3-base:free",
      label: "free",
    },
    {
      name: "Llama 4 Maverick",
      model: "meta-llama/llama-4-maverick:free",
      label: "free",
    },
    {
      name: "NVIDIA Llama Nano",
      model: "nvidia/llama-3.1-nemotron-nano-8b-v1:free",
      label: "free",
    },
    {
      name: "Shisa v2 Llama3.3",
      model: "shisa-ai/shisa-v2-llama3.3-70b:free",
      label: "free",
    },
    { name: "DeepSeek R1", model: "deepseek/deepseek-r1", label: "paid" },
    {
      name: "DeepSeek R1 Free",
      model: "deepseek/deepseek-r1:free",
      label: "free",
    },
    {
      name: "Sarvamai",
      model: "sarvamai/sarvam-m:free",
      label: "free",
    },
  ],
  currentLLMModel: "mistralai/mistral-small-3.1-24b-instruct:free",
  changeCurrentLLMModel: (model: string) =>
    set(() => ({
      currentLLMModel: model,
    })),
}));

const useAuthStore = create<AuthStoreState>()(
  persist<AuthStoreState>(
    (set) => ({
      user: null,
      isLoggedIn: false,
      login: (user: User | null) =>
        set(() => {
          return {
            user: user,
            isLoggedIn: true,
          };
        }),
      logout: () =>
        set(() => {
          return {
            user: null,
            isLoggedIn: false,
          };
        }),
      canUseWithoutAuth: true,
      setCanUseWithoutAuth: (canUse: boolean) =>
        set(() => {
          return {
            canUseWithoutAuth: canUse,
          };
        }),
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

const useImageStore = create<ImageStoreState>((set) => ({
  imageGenerationOn: false,
  generatedImages: [],
  setGeneratedImages: (images: string[]) =>
    set(() => ({
      generatedImages: images,
    })),
  addGeneratedImage: (image: string) =>
    set((state) => ({
      generatedImages: [...state.generatedImages, image],
    })),
  clearGeneratedImages: () =>
    set(() => ({
      generatedImages: [],
    })),
  setImageGenerationOn: (on: boolean) =>
    set(() => ({
      imageGenerationOn: on,
    })),
  isImageGenerating: false,
  setIsImageGenerating: (isGenerating: boolean) =>
    set(() => ({
      isImageGenerating: isGenerating,
    })),
  imageGenerationError: "",
  setImageGenerationError: (error: string) =>
    set(() => ({
      imageGenerationError: error,
    })),
}));

export { useChatStore, useAuthStore, useImageStore };
