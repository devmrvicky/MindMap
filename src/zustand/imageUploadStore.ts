import { create } from "zustand";

const useImageUploadStore = create<ImageUploadStoreState>((set) => ({
  // image chat file store
  uploadedImgs: [],
  wantToImgUpload: false,
  progress: 0,
  setProgress: (progress: number) =>
    set(() => ({
      progress: progress,
    })),
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

export default useImageUploadStore;
