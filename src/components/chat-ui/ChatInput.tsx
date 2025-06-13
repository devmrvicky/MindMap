import { useChatStore } from "@/zustand/store";
// import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import useLLMRequest from "@/hooks/useLLMREquest";
import { useState } from "react";
import { ArrowUp, Globe, ImagePlus, Paperclip } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { Label } from "@/components/ui/label";
import LoginDialog from "../LoginDialog";
import { AxiosError } from "axios";
import { toast } from "react-toastify";

const ChatInput = () => {
  const [prompt, setPrompt] = useState<string>("");
  const [dialogOpen, setDialogOpen] = useState(false);

  const { getLLMResponse } = useLLMRequest();
  const { currentChatsHistory } = useChatStore((state) => state);

  const isMobile = useIsMobile();

  const handleSendChatRequest = async (prompt: string) => {
    try {
      await getLLMResponse(prompt, () => setDialogOpen(true));
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message);
      }
      console.error("Error sending chat request:", error);
    }
  };

  return (
    <div
      className={`bg-white shadow-2xl border max-w-[700px] w-full rounded-2xl my-3 flex flex-col items-center justify-center p-2 ${
        currentChatsHistory.length > 0
          ? `sticky max-w-[500px] w-full bottom-2 bg-blend-hard-light z-50`
          : ""
      }`}
    >
      <Textarea
        placeholder="Ask me anything..."
        className={`rounded-2xl h-[50px] w-full  bg-white placeholder:text-lg text-black border-none focus:outline-none focus:ring-0 focus:border-none shadow-none resize-none`}
        autoFocus
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey && prompt.trim() && !isMobile) {
            handleSendChatRequest(prompt);
            setPrompt("");
            e.currentTarget.blur(); // Remove focus from the input after sending
          } else if (e.key === "Enter" && e.shiftKey) {
            e.preventDefault();
            setPrompt((prev) => prev + "\n");
            console.log(e);
            const textarea = e.currentTarget as HTMLTextAreaElement;
            setTimeout(() => {
              if (textarea) {
                textarea.scrollTop = textarea.scrollHeight;
              }
            }, 0);
          }
        }}
      />
      <div className="flex w-full">
        {/* <p>tools</p> */}
        <div className="flex items-center justify-center gap-1">
          <Label
            htmlFor="file-upload"
            className="bg-white border rounded-full w-10 h-10 flex items-center justify-center mt-2 cursor-pointer"
          >
            <Paperclip className="w-4" />
          </Label>
          <input
            type="file"
            id="file-upload"
            className="hidden"
            disabled={true}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                // Handle file upload here
                console.log("File selected:", file);
                // make blob url and display it in the chat
                const blobUrl = URL.createObjectURL(file);
                console.log(`Blob URL: ${blobUrl}`);
              }
            }}
          />
          {/* internet button */}
          <Button
            variant="outline"
            className="bg-white border rounded-full w-10 h-10 flex items-center justify-center mt-2 cursor-pointer"
          >
            <Globe />
          </Button>
          {/* image creation button */}
          <Button
            variant="outline"
            className="bg-white border rounded-full w-10 h-10 flex items-center justify-center mt-2 cursor-pointer"
          >
            <ImagePlus />
          </Button>
        </div>
        <Button
          variant="outline"
          className="bg-white rounded-full w-10 h-10 flex items-center justify-center mt-2 ml-auto cursor-pointer"
          onClick={() => {
            if (prompt.trim()) {
              handleSendChatRequest(prompt);
              setPrompt("");
            }
          }}
          disabled={!prompt.trim()}
        >
          <ArrowUp className="min-w-2 min-h-2" />
        </Button>
      </div>
      {/* login dialog component */}
      <LoginDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </div>
  );
};

export default ChatInput;
// This component is responsible for rendering the chat input field where users can type their messages. It uses Zustand for state management and handles sending the chat request to the LLM API.
