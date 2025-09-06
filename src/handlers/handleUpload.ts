import { ImageKit } from "@/services/imagekitService";
import { toast } from "react-toastify";

export const handleUpload = async ({
  fileInputRef,
  addImg,
  setWantToImgUpload,
  setProgress,
  updateImg,
}: {
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  addImg: ImageUploadStoreState["addImg"];
  setWantToImgUpload: ImageUploadStoreState["setWantToImgUpload"];
  setProgress: (number: number) => void;
  updateImg: ImageUploadStoreState["updateImg"];
}) => {
  setWantToImgUpload(true);
  // Access the file input element using the ref
  const fileInput = fileInputRef?.current;
  if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
    toast.warn("Please select a file to upload");
    return;
  }

  // Extract the first file from the file input
  const file = fileInput.files[0];

  // set img url in local store to display images
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => {
    const imgSrc = reader.result;
    console.log(imgSrc);
    if (!imgSrc || typeof imgSrc !== "string") {
      toast.error("Failed to read the image file.");
      return;
    }
    addImg({ name: file.name, src: imgSrc });
  };

  try {
    await ImageKit.upload({
      file: file,
      setProgress,
      setWantToImgUpload,
      updateImg,
    });
  } catch (error) {
    console.error("Upload failed:", error);
  }
};
