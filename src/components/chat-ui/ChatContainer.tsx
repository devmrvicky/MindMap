import { useImageStore, useModelStore, useChatStore } from "@/zustand/store";
import Chat from "./Chat";
import Loading from "../utils/Loading";
import { useRef } from "react";
import { useEffect } from "react";
import ImgSkeleton from "../utils/ImgSkelaton";
import { CircleAlert } from "lucide-react";
import RegenerateResBtn from "../buttons/RegenerateResBtn";

const ChatContainer = ({ streamResponse }: { streamResponse: string }) => {
  const { currentChatsHistory } = useChatStore((store) => store);
  const { isResponseLoading, LLMResponsedError } = useModelStore(
    (store) => store
  );
  const { imageGenerationOn } = useImageStore((store) => store);

  const chatRef = useRef<HTMLDivElement | null>(null);

  const smoothScrollToBottom = () => {
    setTimeout(() => {
      if (chatRef.current) {
        chatRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }, 0);
  };

  useEffect(() => {
    smoothScrollToBottom();
  }, [currentChatsHistory.length]);

  return (
    <div
      className={`flex flex-col gap-4 w-full h-screen overflow-auto scrollable-container `}
    >
      {currentChatsHistory.map((message, index) => (
        <Chat
          key={message.chatId}
          // fileUrls={message.fileUrls}
          message={message}
          streamResponse={streamResponse}
          index={index}
          totalChats={currentChatsHistory.length}
          isLLmResponseLoading={isResponseLoading}
          chatRef={chatRef}
          errorRes={Boolean(LLMResponsedError)}
        />
      ))}

      {isResponseLoading && (imageGenerationOn ? <ImgSkeleton /> : <Loading />)}

      {LLMResponsedError && (
        <div className="flex mb-10 flex-col justity-start" ref={chatRef}>
          <div className="text-red-500 text-left flex gap-2 items-center bg-red-500/10 px-4 mb-2 p-2 rounded-lg max-w-fit">
            <CircleAlert className="w-6 h-6 mb-2" />
            <p className="text-sm">
              {LLMResponsedError ||
                "An error occurred while processing your request."}
            </p>
          </div>
          <RegenerateResBtn errorRes={Boolean(LLMResponsedError)} />
        </div>
      )}
    </div>
  );
};

export default ChatContainer;
// This component is responsible for rendering the chat messages in the chat UI. It uses Zustand for state management to access the current chat history and displays each message with appropriate styling based on the sender's role (user or assistant).
// It is a child component of the ChatUI component and is used to display the chat history in a scrollable container.
