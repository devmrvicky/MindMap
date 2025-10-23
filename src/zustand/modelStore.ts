import { create } from "zustand";

const useModelStore = create<ChatModelStoreState>((set) => ({
  chatModels: [
    {
      name: "Mistral: Mistral Small 3.2 24B",
      id: "mistralai/mistral-small-3.2-24b-instruct:free",
      label: "free",
    },
    {
      name: "Z.AI: GLM 4.5 Air",
      id: "z-ai/glm-4.5-air:free",
      label: "free",
    },
    {
      name: "MoonshotAI: Kimi Dev 72B",
      id: "moonshotai/kimi-dev-72b:free",
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
  chatRequestAbortController: undefined,
  setChatRequestAbortController: (controller: AbortController | undefined) =>
    set(() => ({
      chatRequestAbortController: controller,
    })),
  isResponseLoading: false,
  setIsResponseLoading: (isLoading: boolean) =>
    set(() => ({
      isResponseLoading: isLoading,
    })),

  // llm error
  LLMResponsedError: null,
  setLLMResponsedError: (error: string | null) =>
    set(() => ({
      LLMResponsedError: error,
    })),
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
    set(() => ({ chatModels: models })),

  isRegeneratingErrorResponse: false,
  setIsRegeneratingErrorResponse: (isRegenerating: boolean) =>
    set(() => ({
      isRegeneratingErrorResponse: isRegenerating,
    })),
}));

export default useModelStore;
