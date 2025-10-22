import { useImageStore, useModelStore, useChatStore } from "@/zustand/store";
import Chat from "./Chat";
import Loading from "../utils/Loading";
import { RefObject, useEffect } from "react";
import ImgSkeleton from "../utils/ImgSkelaton";
import ErrorResponse from "../ErrorResponse";
import useErrorResponse from "@/hooks/useErrorResponse";

const ChatContainer = ({
  streamResponse,
  chatRef,
  smoothScrollToBottom,
}: {
  streamResponse: string;
  chatRef: RefObject<HTMLDivElement | null>;
  smoothScrollToBottom: () => void;
}) => {
  const currentChatsHistory = useChatStore(
    (store) => store.currentChatsHistory
  );
  const LLMResponsedError = useModelStore((store) => store.LLMResponsedError);
  const isResponseLoading = useModelStore((store) => store.isResponseLoading);
  const imageGenerationOn = useImageStore((store) => store.imageGenerationOn);

  const error = useErrorResponse();

  useEffect(() => {
    smoothScrollToBottom();
  }, [currentChatsHistory.length]);

  return (
    <div className={`flex flex-col gap-4 w-full h-full`}>
      {currentChatsHistory
        .sort((a, b) =>
          a.createdAt && b.createdAt && a.createdAt > b?.createdAt ? 1 : -1
        )
        .map((message, index) => (
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

      {/* in case loading */}
      {isResponseLoading && (imageGenerationOn ? <ImgSkeleton /> : <Loading />)}

      {/* in the case of error */}
      {error && (
        <ErrorResponse chatRef={chatRef} errorMessage={error.message} />
      )}
    </div>
  );
};

export default ChatContainer;
// This component is responsible for rendering the chat messages in the chat UI. It uses Zustand for state management to access the current chat history and displays each message with appropriate styling based on the sender's role (user or assistant).
// It is a child component of the ChatUI component and is used to display the chat history in a scrollable container.
