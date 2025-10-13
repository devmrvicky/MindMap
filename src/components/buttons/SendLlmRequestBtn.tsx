import { ArrowUp } from "lucide-react";
import { Button } from "../ui/button";
import useLLMRequest from "@/hooks/useLLMREquest";
import { toast } from "react-toastify";
import { AxiosError } from "axios";
import { useModelStore } from "@/zustand/store";
import { AbortControllerBtn } from "./AbortControllerBtn";

const SendLlmRequestBtn = ({
  prompt,
  setPrompt,
}: {
  prompt: string;
  setPrompt: (prompt: string) => void;
}) => {
  const { getLLMResponse } = useLLMRequest();
  const isResponseLoading = useModelStore((store) => store.isResponseLoading);

  const handleSendChatRequest = async (prompt: string) => {
    try {
      if (prompt.trim()) {
        await getLLMResponse(prompt);
        setPrompt("");
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message);
      }
      console.error("Error sending chat request:", error);
    }
  };

  if (isResponseLoading) {
    <AbortControllerBtn />;
  }

  return (
    <Button
      variant="outline"
      className="bg-white rounded-full w-10 h-10 flex items-center justify-center cursor-pointer"
      onClick={() => handleSendChatRequest(prompt)}
      disabled={!prompt.trim()}
    >
      <ArrowUp className="min-w-2 min-h-2" />
    </Button>
  );
};

export default SendLlmRequestBtn;
