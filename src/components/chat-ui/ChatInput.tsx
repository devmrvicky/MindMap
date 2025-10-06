import { useImageUploadStore } from "@/zustand/store";
import { Textarea } from "@/components/ui/textarea";
import useLLMRequest from "@/hooks/useLLMREquest";
import { useRef, useState } from "react";
import { Loader } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import LoginDialog from "../LoginDialog";
import { AxiosError } from "axios";
import { toast } from "react-toastify";
import useWebSpeech from "@/hooks/useWebSpeech";
import ChatInputToolsBtn from "../ChatInputToolsBtn";

// import { Dispatch, SetStateAction } from "react";
import { useParams } from "react-router";
import { useScrollDetection } from "@/hooks/useScrollDetection";

const ChatInput = () => {
  // get all var to use mice button
  const { recognitionRef } = useWebSpeech();
  const [prompt, setPrompt] = useState<string>("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [wantToImgUpload, setWantToImgUpload] = useState(false);

  const prevClass = useRef<string>("h-[50px]");

  const { getLLMResponse } = useLLMRequest();
  const uploadedImgs = useImageUploadStore((state) => state.uploadedImgs);

  const { chatRoomId } = useParams();

  const isMobile = useIsMobile();

  const { isScrollUp } = useScrollDetection();

  const handleSendChatRequest = async (prompt: string) => {
    try {
      await getLLMResponse(prompt);
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message);
      }
      console.error("Error sending chat request:", error);
    }
  };

  return (
    <div
      className={` bg-white/70 dark:bg-zinc-800/50 backdrop-blur-sm  shadow-2xl border max-w-[700px] w-full rounded-2xl my-3 flex flex-col items-center justify-center p-2 ${
        chatRoomId
          ? `transition-[bottom] duration-100 ease-in-out sticky ${
              isScrollUp ? "bottom-2" : "bottom-[-100%]"
            } max-w-[500px] bg-blend-hard-light z-50`
          : ""
      } `}
    >
      {wantToImgUpload && uploadedImgs.length === 0 && (
        <div className="w-full flex items-center gap-2 mb-2 top-[0px]  overflow-x-auto relative z-0">
          <div className="w-[80px] h-[80px] rounded border flex items-center justify-center">
            <Loader className="spin " />
          </div>
        </div>
      )}

      {/* uploaded images */}
      {uploadedImgs.length > 0 && (
        <div className="w-full flex items-center gap-2 mb-2 top-[0px]  overflow-x-auto relative z-0">
          {/* {wantToImgUpload && (
            <div className="w-[80px] h-[80px] rounded border flex items-center justify-center">
              <Loader className="spin " />
            </div>
          )} */}
          {uploadedImgs.map((img) => (
            <div className="w-[80px] h-[80px] rounded border relative">
              <img src={img.src} alt={img.name} className="w-fll h-full" />
              <button
                className="absolute top-0 right-0 text-red-500"
                onClick={() =>
                  useImageUploadStore.getState().removeImg(img.name)
                }
              >
                &times;
              </button>
              {wantToImgUpload && (
                <div className="w-[80px] h-[80px] rounded border flex items-center justify-center absolute top-0 right-0">
                  <Loader className="spin " />
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <Textarea
        placeholder="Ask me anything..."
        className={`rounded-2xl h-[50px] max-h-[200px] w-full bg-white dark:bg-[#303033] placeholder:text-lg dark:text-white text-black border-none focus:outline-none focus:ring-0 focus:border-none shadow-none resize-none`}
        autoFocus
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        ref={recognitionRef}
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
                console.log(textarea.scrollHeight);
                textarea.classList.replace(
                  prevClass.current,
                  `h-[${textarea.scrollHeight}px]`
                );
                prevClass.current = `h-[${textarea.scrollHeight}px]`;
              }
            }, 0);
          }
        }}
      />
      <div className="flex w-full">
        {/* <p>tools</p> */}
        <ChatInputToolsBtn
          prompt={prompt}
          setPrompt={setPrompt}
          setWantToImgUpload={setWantToImgUpload}
        />
      </div>
      {/* login dialog component */}
      <LoginDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </div>
  );
};

export default ChatInput;
// This component is responsible for rendering the chat input field where users can type their messages. It uses Zustand for state management and handles sending the chat request to the LLM API.
