import { useIsMobile } from "@/hooks/use-mobile";
import GreetingMessageComp from "../GreetingMessage";
import ChatContainer from "./ChatContainer";
import ChatInput from "./ChatInput";
import { useChatStore } from "@/zustand/store";
import { useRef } from "react";
import { useChatInit } from "@/hooks/useChatInit";
import ChatSkeleton from "./ChatSketeton";
import { useParams } from "react-router";

const ChatUI = () => {
  const currentChatsHistory = useChatStore((s) => s.currentChatsHistory);
  const setCurrentChatsHistory = useChatStore((s) => s.setCurrentChatsHistory);

  const isMobile = useIsMobile();
  const { chatRoomId } = useParams<{ chatRoomId: string }>();

  useChatInit({ setCurrentChatsHistory });

  const chatContainerRef = useRef<HTMLDivElement | null>(null);

  return (
    <div className="bg-white dark:bg-black w-full h-full chat-container">
      <div
        className={`max-w-[900px] mx-auto w-full p-4 h-full flex flex-col relative items-center ${
          isMobile
            ? `pb-0 ${chatRoomId ? "justify-between" : "justify-end"}`
            : `${chatRoomId ? "justify-between" : "justify-center"}`
        }`}
        ref={chatContainerRef}
      >
        {!chatRoomId && <GreetingMessageComp />}

        {chatRoomId &&
          (currentChatsHistory.length > 0 ? (
            <ChatContainer streamResponse="" />
          ) : (
            <ChatSkeleton />
          ))}

        {/* Chat input */}
        <ChatInput />
      </div>
    </div>
  );
};

export default ChatUI;
