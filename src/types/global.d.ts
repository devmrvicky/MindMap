export {};

declare global {
  interface Chat {
    chatId: string;
    role: "user" | "assistant";
    content: {
      fileUrls?: string[]; // optional field for file URLs
      content: string;
      type: "text" | "image";
      model: string;
    }[];
    chatRoomId: string;
    createdAt?: number;
  }

  interface ChatStoreState {
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
  }

  // chat room
  interface ChatRoomStoreState {
    chatRooms: ChatRoom[];
    setChatRooms: (chatRooms: ChatRoom[]) => void;
    activeChatRoom: ActiveChatRoom;
    setActiveChatRoom: (chatRoom: ActiveChatRoom) => void;
    createNewChatRoomOnLocal: (newChatRoom: ChatRoom) => void;
    deleteChatRoomFromLocal: (id: string, isActiveChatRoom: boolean) => void;
    isChatRoomsFetching: boolean;
    setIsChatRoomsFetching: (isFetching: boolean) => void;
  }

  interface ChatModelStoreState {
    isResponseLoading: boolean;
    LLMResponsedError: string | null;
    // partial Model type I want only id, name and label fields here not all Model type fields
    chatModels: Partial<Model>[];
    imageModels: Partial<Model>[];
    currentLLMModel: Partial<Model>;
    chatRequestAbortController: AbortController | undefined;

    setIsResponseLoading: (isLoading: boolean) => void;
    setLLMResponsedError: (error: string | null) => void;
    changeCurrentLLMModel: (model: Partial<Model>) => void;
    toggleChatModel: (model: Partial<Model>) => void;
    setChatModels: (models: Partial<Model>[]) => void;
    setChatRequestAbortController: (controller: AbortController) => void;

    isRegeneratingErrorResponse: boolean;
    setIsRegeneratingErrorResponse: (isRegenerating: boolean) => void;
  }

  interface ImageUploadStoreState {
    uploadedImgs: UploadedImg[];
    setUploadedImgs: (imgs: UploadedImg[]) => void;
    addImg: (img: UploadedImg) => void;
    removeImg: (targetImgName: string) => void;
    updateImg: (img: UploadedImg) => void;
    wantToImgUpload: boolean;
    setWantToImgUpload: (doesUploaded: boolean) => void;
    progress: number;
    setProgress: (progress: number) => void;
  }

  interface UploadedImg {
    name: string;
    src: string;
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

  type storeName = "chat" | "chatRoom" | "model" | "currentlyUsedModels";
  type Data = Chat | ChatRoom | Model | Partial<Model> | ErrorResponse;

  interface Model {
    id: string;
    name: string;
    description: string;
    context_length: number;
    label?: string;
    architecture: {
      modality: string;
      input_modalities: string[];
      output_modalities: string[];
      tokenizer: string;
      instruct_type: string;
    };
    pricing: {
      prompt: string;
      completion: string;
      request: string;
      image: string;
      web_search: string;
      internal_reasoning: string;
    };
    supported_parameters: string[];
  }

  interface ErrorResponse {
    success: false;
    message: string;
    errorType: string;
    statusCode?: number;
    details?: any;
    id: string;
  }

  interface AuthStoreState {
    user: User | null;
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
