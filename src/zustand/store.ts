import { create } from "zustand";

const useChatStore = create<StoreState>((set) => ({
  chatsHistory: [],
  currentChatsHistory: [],
  addNewChat: (newChat: Chat) =>
    set((state) => ({
      chatsHistory: [...state.chatsHistory, newChat],
    })),
  setCurrentChatsHistory: (chats: Chat[]) =>
    set(() => ({
      currentChatsHistory: chats,
    })),

  chatRooms: [
    // {
    //   id: "chatRoomNo1",
    //   chatRoomName: "my first chat",
    // },
    // {
    //   id: "chatRoomNo2",
    //   chatRoomName: "what is your name?",
    // },
  ],
  activeChatRoom: null,
  isChatRoomActive: false,
  setActiveChatRoom: (chatRoom: ChatRoom) =>
    set(() => {
      console.log("from store", chatRoom);
      return { activeChatRoom: chatRoom };
    }),
  createNewChatRoom: (newChatRoom: ChatRoom) =>
    set((state) => {
      // console.log("creating new chat room", newChatRoom);
      return {
        isChatRoomActive: true,
        activeChatRoom: newChatRoom,
        chatRooms: [...state.chatRooms, newChatRoom],
      };
    }),

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
  ],
  currentLLMModel: "mistralai/mistral-small-3.1-24b-instruct:free",
  changeCurrentLLMModel: (model: string) =>
    set(() => ({
      currentLLMModel: model,
    })),
}));

export { useChatStore };
