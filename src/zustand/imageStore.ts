import { create } from "zustand";

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

export default useImageStore;
