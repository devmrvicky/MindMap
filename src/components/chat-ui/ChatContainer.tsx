import { useChatStore } from "@/zustand/store";
import Chat from "./Chat";
import Loading from "../utils/Loading";
import { useRef } from "react";
import { useEffect } from "react";

const ChatContainer = () => {
  const { isResponseLoading, currentChatsHistory } = useChatStore(
    (state) => state
  );

  console.log("chats from chat container ", currentChatsHistory);
  const chatRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setTimeout(() => {
      if (chatRef.current) {
        chatRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }, 0);
  }, [currentChatsHistory]);

  return (
    <div className="flex flex-col gap-4 w-full h-screen overflow-y-auto">
      {currentChatsHistory.map((message, index) => (
        <Chat
          key={message.chatId}
          message={message}
          index={index}
          totalChats={currentChatsHistory.length}
          isLLmResponseLoading={isResponseLoading}
          chatRef={chatRef}
        />
      ))}

      {isResponseLoading && <Loading />}
    </div>
  );
};

export default ChatContainer;
// This component is responsible for rendering the chat messages in the chat UI. It uses Zustand for state management to access the current chat history and displays each message with appropriate styling based on the sender's role (user or assistant).
// It is a child component of the ChatUI component and is used to display the chat history in a scrollable container.
