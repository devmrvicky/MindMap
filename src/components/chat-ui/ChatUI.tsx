import { useIsMobile } from "@/hooks/use-mobile";
import GreetingMessageComp from "../GreetingMessage";
import ChatContainer from "./ChatContainer";
import ChatInput from "./ChatInput";
import { useChatStore } from "@/zustand/store";
import { useState, useRef } from "react";
import { useChatInit } from "@/hooks/useChatInit";

const ChatUI = () => {
  // stream response (we are declairing stream response here because chat ui is paret component of chat input and chat container, so we can pass stream response to both component if needed)
  const [streamResponse] = useState("");

  const { currentChatsHistory, setCurrentChatsHistory } = useChatStore(
    (state) => state
  );

  const isMobile = useIsMobile();

  useChatInit({ setCurrentChatsHistory });

  const chatContainerRef = useRef<HTMLDivElement | null>(null);

  // const { isScrollDown, isScrollUp } = useScrollDetection(chatContainerRef);

  // console.log({ isScrollDown, isScrollUp });

  return (
    <div
      className="bg-white dark:bg-black w-full h-full chat-container"
      // ref={chatContainerRef}
    >
      <div
        className={`max-w-[900px] mx-auto p-4 h-full flex items-center  flex-col ${
          isMobile ? "pb-0 justify-end" : "justify-center"
        } ${currentChatsHistory.length > 0 ? "justify-end items-center" : ""} `}
        ref={chatContainerRef}
      >
        {!currentChatsHistory.length && <GreetingMessageComp />}

        {!currentChatsHistory.length || (
          <ChatContainer streamResponse={streamResponse ?? ""} />
        )}

        {/* chat input */}
        <ChatInput />
      </div>
    </div>
  );
};

export default ChatUI;
