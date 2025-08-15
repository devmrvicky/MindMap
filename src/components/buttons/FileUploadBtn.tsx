import { Paperclip } from "lucide-react";
import { Label } from "../ui/label";
import { useChatStore } from "@/zustand/store";
import { toast } from "react-toastify";
import {
  ImageKitAbortError,
  ImageKitInvalidRequestError,
  ImageKitServerError,
  ImageKitUploadNetworkError,
  upload,
} from "@imagekit/react";
import axiosConfig from "@/axios/axiosConfig";
import { useRef, useState } from "react";

const FileUploadBtn = () => {
  const { addImg, setWantToImgUpload, updateImg } = useChatStore(
    (store) => store
  );

  // State to keep track of the current upload progress (percentage)
  const [progress, setProgress] = useState(0);
  console.log(progress);

  // Create a ref for the file input element to access its files easily
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Create an AbortController instance to provide an option to cancel the upload if needed.
  const abortController = new AbortController();

  const authenticator = async () => {
    try {
      const response = await axiosConfig.get("/imagekit/auth");
      // handle error
      if (response.status !== 200) {
        throw new Error("Failed to retrieve authentication data");
      }
      console.log(response.data);
      const { signature, expire, token, publicKey } = response.data.data;
      return { signature, expire, token, publicKey };
    } catch (error) {
      // Log the original error for debugging before rethrowing a new error.
      console.error("Authentication error:", error);
      throw new Error("Authentication request failed");
    }
  };

  const handleUpload = async () => {
    setWantToImgUpload(true);
    // Access the file input element using the ref
    const fileInput = fileInputRef.current;
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

    // Retrieve authentication parameters for the upload.
    let authParams;
    try {
      authParams = await authenticator();
    } catch (authError) {
      console.error("Failed to authenticate for upload:", authError);
      return;
    }
    const { signature, expire, token, publicKey } = authParams;

    // Call the ImageKit SDK upload function with the required parameters and callbacks.
    try {
      const uploadResponse = await upload({
        // Authentication parameters
        expire,
        token,
        signature,
        publicKey,
        file,
        fileName: file.name, // Optionally set a custom file name
        // Progress callback to update upload progress state
        onProgress: (event) => {
          setProgress((event.loaded / event.total) * 100);
        },
        // Abort signal to allow cancellation of the upload if needed.
        abortSignal: abortController.signal,
      });
      console.log("Upload response:", uploadResponse);
      // update local store of uploaded images
      if (uploadResponse && uploadResponse.url) {
        updateImg({ name: file.name, src: uploadResponse.url });
        toast.success("File uploaded successfully!");
      } else {
        toast.error("File upload failed. No URL returned.");
      }
    } catch (error) {
      // Handle specific error types provided by the ImageKit SDK.
      if (error instanceof ImageKitAbortError) {
        console.error("Upload aborted:", error.reason);
      } else if (error instanceof ImageKitInvalidRequestError) {
        console.error("Invalid request:", error.message);
      } else if (error instanceof ImageKitUploadNetworkError) {
        console.error("Network error:", error.message);
      } else if (error instanceof ImageKitServerError) {
        console.error("Server error:", error.message);
      } else {
        // Handle any other errors that may occur.
        console.error("Upload error:", error);
      }
    } finally {
      setWantToImgUpload(false);
    }
  };

  return (
    <div>
      <Label
        htmlFor="file-upload"
        className=" border rounded-full w-10 h-10 flex items-center justify-center mt-2 cursor-pointer"
      >
        <Paperclip className="w-4" />
      </Label>
      <input
        type="file"
        id="file-upload"
        className="hidden"
        ref={fileInputRef}
        // disabled={true}
        onChange={handleUpload}
      />
    </div>
  );
};

export default FileUploadBtn;
