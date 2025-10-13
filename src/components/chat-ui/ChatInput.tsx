import SendLlmRequestBtn from "../buttons/SendLlmRequestBtn";
import MicBtn from "../buttons/MicBtn";
import ChatInputToolsPopover from "../ChatInputToolsPopover";
import { Textarea } from "../ui/textarea";
import { useRef } from "react";
import useWebSpeech from "@/hooks/useWebSpeech";
import { useIsMobile } from "@/hooks/use-mobile";
import useLLMRequest from "@/hooks/useLLMREquest";
import { toast } from "react-toastify";
import { AxiosError } from "axios";

export function ChatInput({
  prompt,
  setPrompt,
  setWantToImgUpload,
}: {
  prompt: string;
  setPrompt: React.Dispatch<React.SetStateAction<string>>;
  setWantToImgUpload: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const { getLLMResponse } = useLLMRequest();

  const inputContainerClass = useRef<string>("grid-cols-[auto_1fr_auto]"); // grid-cols-[1fr_1fr] grid-rows-2
  const popoverBtnClass = useRef<string>(""); // order-[2]
  const inputClass = useRef<string>(""); //  col-span-2
  const sendResponseBtnClass = useRef<string>(""); // order-last

  // const prevHeight = useRef<string>("h-[60px]");
  const { recognitionRef } = useWebSpeech();
  const isMobile = useIsMobile();
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
      className={`border w-full grid ${inputContainerClass.current} items-center rounded-2xl  px-2 bg-zinc-800"`}
    >
      <ChatInputToolsPopover
        setWantToImgUpload={setWantToImgUpload}
        className={`${popoverBtnClass.current}`}
      />
      <Textarea
        placeholder="Ask me anything..."
        className={`rounded-2xl  max-h-[200px] w-full bg-transparent placeholder:text-lg dark:text-white text-black border-none focus-visible:outline-none focus-visible:ring-0 focus-visible:border-none shadow-none resize-none dark:bg-input/0 py-4 px-2 ${inputClass.current} `}
        autoFocus
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        ref={recognitionRef}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey && prompt.trim() && !isMobile) {
            handleSendChatRequest(prompt);
            setPrompt("");
            e.currentTarget.focus();
          } else if (
            (e.key === "Enter" && isMobile) ||
            (e.key === "Enter" && e.shiftKey)
          ) {
            e.preventDefault();
            setPrompt((prev) => prev + "\n");
            // update classes of popover button, textarea and send request button
            inputContainerClass.current =
              "grid-cols-[auto_auto] grid-rows-[auto_auto] py-2";
            inputClass.current = "col-span-2";
            sendResponseBtnClass.current = "justify-end order-last";
            popoverBtnClass.current = "order-[2]";

            const textarea = e.currentTarget as HTMLTextAreaElement;
            if (textarea) {
              textarea.scrollTop = textarea.scrollHeight;
              console.log(textarea.scrollHeight);
            }
          }
        }}
      />
      <div
        className={`flex items-center gap-2 ${sendResponseBtnClass.current}`}
      >
        <MicBtn setPrompt={setPrompt} />
        <SendLlmRequestBtn prompt={prompt} setPrompt={setPrompt} />
      </div>
    </div>
  );
}
