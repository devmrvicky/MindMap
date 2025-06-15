import axiosConfig from "@/axios/axiosConfig";
import { AxiosError } from "axios";
import { toast } from "react-toastify";

const useGenerateImage = () => {
  const generateImage = async ({ prompt }: { prompt: string }) => {
    try {
      const res = await axiosConfig.post("/chat/image/generate", {
        prompt,
      });
      return res;
    } catch (error) {
      console.error(error);
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message);
      }
      return error;
    }
  };

  return { generateImage };
};

export default useGenerateImage;
