import { ArrowUp } from "lucide-react";
import { Button } from "../ui/button";
import useLLMRequest from "@/hooks/useLLMREquest";
import { toast } from "react-toastify";
import { AxiosError } from "axios";

const SendLlmRequestBtn = ({
  prompt,
  setPrompt,
}: {
  prompt: string;
  setPrompt: (prompt: string) => void;
}) => {
  const { getLLMResponse } = useLLMRequest();

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

  return (
    <Button
      variant="outline"
      className="bg-white rounded-full w-10 h-10 flex items-center justify-center mt-2 ml-auto cursor-pointer"
      onClick={() => handleSendChatRequest(prompt)}
      disabled={!prompt.trim()}
    >
      <ArrowUp className="min-w-2 min-h-2" />
    </Button>
  );
};

export default SendLlmRequestBtn;
