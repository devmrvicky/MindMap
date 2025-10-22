import SendLlmRequestBtn from "../buttons/SendLlmRequestBtn";
import MicBtn from "../buttons/MicBtn";
import ChatInputToolsPopover from "../ChatInputToolsPopover";
import { Textarea } from "../ui/textarea";
import React, { useRef } from "react";
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

  // textarea ref
  // const textareaRef = useRef<HTMLTextAreaElement>(null);

  const inputContainerClass = useRef<string>("grid-cols-[auto_1fr_auto]"); // grid-cols-[1fr_1fr] grid-rows-2
  const popoverBtnClass = useRef<string>(""); // order-[2]
  const inputClass = useRef<string>(""); //  col-span-2
  const sendResponseBtnClass = useRef<string>(""); // order-last

  // const prevHeight = useRef<string>("h-[60px]");
  const { recognitionRef } = useWebSpeech();
  const isMobile = useIsMobile();
  const handleSendChatRequest = async (prompt: string) => {
    try {
      if (!prompt.trim()) return;
      setPrompt("");
      await getLLMResponse({ prompt: prompt.trim() });
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message);
      }
      console.error("Error sending chat request:", error);
    }
  };

  const textareaInitHeight = 64;
  const textareaMaxHeight = 200;

  const handleTextareaHeight = (textarea: HTMLTextAreaElement) => {
    if (textarea) {
      textarea.scrollTop = textarea.scrollHeight;
    }
    if (textarea.scrollHeight === textareaMaxHeight) return;
    if (textarea.scrollHeight === textareaInitHeight) {
      inputContainerClass.current = "grid-cols-[auto_1fr_auto]";
      inputClass.current = "";
      sendResponseBtnClass.current = "";
      popoverBtnClass.current = "";
    } else if (textarea.scrollHeight > textareaInitHeight) {
      inputContainerClass.current =
        "grid-cols-[auto_auto] grid-rows-[auto_auto] py-2";
      inputClass.current = "col-span-2";
      sendResponseBtnClass.current = "justify-end order-last";
      popoverBtnClass.current = "order-[2]";
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const textarea = e.currentTarget as HTMLTextAreaElement;

    if (e.key === "Enter" && !e.shiftKey && prompt.trim() && !isMobile) {
      // setPrompt("");
      handleSendChatRequest(prompt);
    } else if (
      (e.key === "Enter" && isMobile) ||
      (e.key === "Enter" && e.shiftKey)
    ) {
      e.preventDefault();
      setPrompt((prev) => prev + "\n");
    }

    if (!(e.key === "Enter" && !isMobile)) handleTextareaHeight(textarea);
  };

  return (
    <div
      className={`border w-full grid items-center rounded-2xl  px-2 bg-[#ECECEE] dark:bg-zinc-900/80 backdrop-blur-sm shadow-2xl ${inputContainerClass.current} `}
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
        onKeyDown={handleKeyDown}
      />
      <div
        className={`flex items-center gap-2 ${sendResponseBtnClass.current}`}
      >
        <MicBtn setPrompt={setPrompt} />
        <SendLlmRequestBtn
          prompt={prompt}
          handleSendChatRequest={handleSendChatRequest}
        />
      </div>
    </div>
  );
}
