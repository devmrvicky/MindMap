import { getAllData } from "@/indexDB/indexDB";
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
  chatModels: [
    {
      name: "Mistral 24b",
      id: "mistralai/mistral-small-3.1-24b-instruct:free",
      label: "free",
    },
  ],
  // image models
  imageModels: [
    {
      name: "Black forest labs flux schnell",
      id: "black-forest-labs/flux-schnell",
      label: "free",
    },
    {
      name: "Black forest labs flux dev",
      id: "black-forest-labs/flux-dev",
      label: "free",
    },

    {
      name: "Stability ai sdxl",
      id: "stability-ai/sdxl",
      label: "free",
    },
  ],
  currentLLMModel: {
    name: "Mistral 24b",
    id: "mistralai/mistral-small-3.1-24b-instruct:free",
    label: "free",
  },
  changeCurrentLLMModel: (model: Partial<Model>) =>
    set(() => ({
      currentLLMModel: model,
    })),
  toggleChatModel: (model: Partial<Model>) =>
    set((state) => ({
      // add model if current model doesn't exit in list and remove if it exists

      chatModels: state.chatModels.find((m) => m.id === model.id)
        ? state.chatModels.filter((m) => m.id !== model.id)
        : [...state.chatModels, model],
    })),
  setChatModels: (models: Partial<Model>[]) =>
    set(() => {
      getAllData({ storeName: "currentlyUsedModels" }).then((res) => {
        console.log(res);
      });
      return { chatModels: models };
    }),

  // image file store
  uploadedImgs: [],
  wantToImgUpload: false,
  setWantToImgUpload: (doesUploaded: boolean) =>
    set(() => ({
      wantToImgUpload: doesUploaded,
    })),
  setUploadedImgs: (imgs: UploadedImg[]) =>
    set(() => ({
      uploadedImgs: imgs,
    })),
  addImg: (img: UploadedImg) =>
    set((state) => ({
      uploadedImgs: [img, ...state.uploadedImgs],
    })),
  removeImg: (targetImgName) =>
    set((state) => ({
      uploadedImgs: state.uploadedImgs.filter(
        (img) => img.name !== targetImgName
      ),
    })),
  updateImg: (img: UploadedImg) =>
    set((state) => ({
      uploadedImgs: state.uploadedImgs.map((i) =>
        i.name === img.name ? img : i
      ),
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

const useThemeStore = create<ThemeStoreState>((set) => ({
  isDarkMode: false,
  setDarkMode: (isDark: boolean) =>
    set(() => ({
      isDarkMode: isDark,
    })),
}));

export { useChatStore, useAuthStore, useImageStore, useThemeStore };
