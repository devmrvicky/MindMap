import { useChatStore } from "@/zustand/store";
import Chat from "./Chat";
import Loading from "../utils/Loading";
import { useEffect, useRef } from "react";

const ChatContainer = () => {
  const { isResponseLoading, currentChatsHistory } = useChatStore(
    (state) => state
  );

  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function scrollToBottom() {
      const chatContainer = chatContainerRef.current;

      // Scroll logic
      if (chatContainer) {
        // Use smooth scrolling for better UX
        chatContainer.scrollTo({
          top: chatContainer.scrollHeight,
          behavior: "smooth",
        });
      }
    }
    scrollToBottom();
  }, [currentChatsHistory]);

  // const currentChatsHistory = activeChatRoom?.chats || [];

  console.log("current history from chat container", { currentChatsHistory });

  return (
    <div
      className="flex flex-col gap-4 w-full h-full overflow-y-auto"
      ref={chatContainerRef}
    >
      {currentChatsHistory.map((message, index) => (
        <Chat
          key={message.id}
          message={message}
          index={index}
          totalChats={currentChatsHistory.length}
          isLLmResponseLoading={isResponseLoading}
        />
      ))}

      {isResponseLoading && <Loading />}
    </div>
  );
};

export default ChatContainer;
// This component is responsible for rendering the chat messages in the chat UI. It uses Zustand for state management to access the current chat history and displays each message with appropriate styling based on the sender's role (user or assistant).
// It is a child component of the ChatUI component and is used to display the chat history in a scrollable container.
