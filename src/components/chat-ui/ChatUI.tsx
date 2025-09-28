import { useIsMobile } from "@/hooks/use-mobile";
import GreetingMessageComp from "../GreetingMessage";
import ChatContainer from "./ChatContainer";
import ChatInput from "./ChatInput";
import { useChatStore } from "@/zustand/store";
import { useChatInit } from "@/hooks/useChatInit";
import ChatSkeleton from "./ChatSketeton";
import { useParams } from "react-router";
import { UserQueryListPopup } from "./UserQueryListPopup";
import { useRef } from "react";

const ChatUI = () => {
  const currentChatsHistory = useChatStore((s) => s.currentChatsHistory);
  const setCurrentChatsHistory = useChatStore((s) => s.setCurrentChatsHistory);

  const isMobile = useIsMobile();
  const { chatRoomId } = useParams<{ chatRoomId: string }>();

  useChatInit({ setCurrentChatsHistory });

  const chatContainerRef = useRef<HTMLDivElement | null>(null);

  const chatRef = useRef<HTMLDivElement | null>(null);

  const smoothScrollToBottom = () => {
    console.log(chatRef);
    setTimeout(() => {
      if (chatRef.current) {
        chatRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }, 0);
  };

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
            <>
              <UserQueryListPopup
                userQueries={currentChatsHistory
                  .filter((chat) => chat.role === "user")
                  .map((chat) => chat.content[0].content)}
                smoothScrollToBottom={smoothScrollToBottom}
              />
              <ChatContainer
                streamResponse=""
                chatRef={chatRef}
                smoothScrollToBottom={smoothScrollToBottom}
              />
            </>
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
