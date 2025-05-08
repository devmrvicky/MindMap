import { useIsMobile } from "@/hooks/use-mobile";
import GreetingMessageComp from "../GreetingMessage";
import ChatContainer from "./ChatContainer";
import ChatInput from "./ChatInput";
import { useChatStore } from "@/zustand/store";

const ChatUI = () => {
  const { currentChatsHistory } = useChatStore((state) => state);
  //  const currentChatsHistory = activeChatRoom?.chats || [];
  const isMobile = useIsMobile();

  return (
    <div
      className="bg-white w-full h-full chat-container"
      // ref={chatContainerRef}
    >
      <div
        className={`max-w-[900px] mx-auto p-4 h-full flex items-center  flex-col ${
          isMobile ? "pb-0 justify-end" : "justify-center"
        }`}
      >
        {!currentChatsHistory.length && <GreetingMessageComp />}

        {!currentChatsHistory.length || <ChatContainer />}

        {/* chat input */}
        <ChatInput />
      </div>
    </div>
  );
};

export default ChatUI;
