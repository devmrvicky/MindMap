import { useIsMobile } from "@/hooks/use-mobile";
import GreetingMessageComp from "../GreetingMessage";
import ChatContainer from "./ChatContainer";
import ChatInput from "./ChatInputContainer";
import { useChatStore } from "@/zustand/store";
import { useChatInit } from "@/hooks/useChatInit";
import ChatSkeleton from "./ChatSketeton";
import { useParams } from "react-router";
import { useRef } from "react";
import { LockKeyhole } from "lucide-react";
import { useScrollDetection } from "@/hooks/useScrollDetection";
import { env } from "@/env/env";

const ChatUI = () => {
  const currentChatsHistory = useChatStore((s) => s.currentChatsHistory);
  const setCurrentChatsHistory = useChatStore((s) => s.setCurrentChatsHistory);

  const isMobile = useIsMobile();
  const { chatRoomId } = useParams<{ chatRoomId: string }>();

  const urlPath = window.location.pathname;
  const isSharedChatRoom = urlPath.split("/")[1] === "share";

  useChatInit({ setCurrentChatsHistory, isSharedChatRoom });

  const chatContainerRef = useRef<HTMLDivElement | null>(null);

  const chatRef = useRef<HTMLDivElement | null>(null);

  const { isScrollUp } = useScrollDetection();

  const smoothScrollToBottom = () => {
    console.log(chatRef);
    setTimeout(() => {
      if (chatRef.current) {
        chatRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }, 0);
  };

  if (isSharedChatRoom && currentChatsHistory.length === 0) {
    return (
      <div className="max-w-[500px] mx-auto w-full text-zinc-500 text-sm flex items-center pt-10">
        <p>Can't load shared conversation {chatRoomId}</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-black w-full h-full chat-container">
      {/* shared chat room info */}
      {isSharedChatRoom && (
        <p
          className={`flex items-center gap-2 text-zinc-400 text-sm sticky ${
            isScrollUp ? "top-[70px]" : "top-4"
          } transition-all z-10 justify-center bg-slate-700/40 backdrop-blur-2xl p-1 rounded-full max-w-[500px] mx-auto w-full`}
        >
          <LockKeyhole className="w-[14px] h-[14px]" />
          <span>
            This is a copy of a conversation between {env.VITE_APP_NAME} &
            Anonymous.
          </span>
        </p>
      )}

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
            <ChatContainer
              streamResponse=""
              chatRef={chatRef}
              smoothScrollToBottom={smoothScrollToBottom}
            />
          ) : (
            <ChatSkeleton />
          ))}

        {/* Chat input */}
        {!isSharedChatRoom && <ChatInput />}
      </div>
    </div>
  );
};

export default ChatUI;
