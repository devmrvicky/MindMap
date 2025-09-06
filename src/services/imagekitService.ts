import { axiosConfig } from "@/api/axiosConfig";
import {
  ImageKitAbortError,
  ImageKitInvalidRequestError,
  ImageKitServerError,
  ImageKitUploadNetworkError,
  upload,
} from "@imagekit/react";
import { toast } from "react-toastify";

export class ImageKitService {
  private signature: string;
  private expire: number | null;
  private token: string;
  private publicKey: string;
  private abortController = new AbortController();

  constructor() {
    this.signature = "";
    this.expire = null;
    this.token = "";
    this.publicKey = "";
  }

  private async imagekitAuthenticator() {
    try {
      const response = await axiosConfig.get("/imagekit/auth");
      // handle error
      if (response.status !== 200) {
        throw new Error("Failed to retrieve authentication data");
      }

      const { signature, expire, token, publicKey } = response.data.data;
      this.signature = signature;
      this.expire = expire;
      this.token = token;
      this.publicKey = publicKey;
      return { signature, expire, token, publicKey };
    } catch (error) {
      // Log the original error for debugging before rethrowing a new error.
      console.error("Authentication error:", error);
      throw new Error("Authentication request failed");
    }
  }

  async upload({
    file,
    setProgress,
    setWantToImgUpload,
    updateImg,
  }: {
    file: File;
    setProgress: (progress: number) => void;
    setWantToImgUpload: (want: boolean) => void;
    updateImg: (img: { name: string; src: string }) => void;
  }) {
    try {
      await this.imagekitAuthenticator();
      if (
        this.expire === null ||
        this.signature === "" ||
        this.token === "" ||
        this.publicKey === ""
      ) {
        throw new Error("Authentication parameters are missing");
      }
      const uploadResponse = await upload({
        // Authentication parameters
        expire: this.expire,
        token: this.token,
        signature: this.signature,
        publicKey: this.publicKey,
        file,
        fileName: file.name, // Optionally set a custom file name
        // Progress callback to update upload progress state
        onProgress: (event) => {
          setProgress((event.loaded / event.total) * 100);
        },
        // Abort signal to allow cancellation of the upload if needed.
        abortSignal: this.abortController.signal,
      });
      // console.log("Upload response:", uploadResponse, progress);
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
  }

  static async delete(fileId: string) {
    const res = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/delete-image/${fileId}`,
      {
        method: "DELETE",
      }
    );
    if (!res.ok) throw new Error("Failed to delete image");
    return await res.json();
  }
}

export const ImageKit = new ImageKitService();
