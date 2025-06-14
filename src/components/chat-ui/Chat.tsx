import Markdown from "react-markdown";
import { RefObject, useEffect, useState } from "react";
import { ChevronRight } from "lucide-react";
import { Collapsible } from "@radix-ui/react-collapsible";
import { CollapsibleContent, CollapsibleTrigger } from "../ui/collapsible";
import ChatActionsBtns from "../ChatActionsBtns";

const Chat = ({
  message,
  index,
  totalChats,
  isLLmResponseLoading,
  chatRef,
}: {
  message: Chat;
  index: number;
  totalChats: number;
  isLLmResponseLoading: boolean;
  chatRef: RefObject<HTMLDivElement | null>;
}) => {
  const [thinking, setThinking] = useState<string | null>(null);
  const [actualResponse, setActualResponse] = useState<string>("");

  useEffect(() => {
    if (message.role === "assistant" && message.content.includes("</think>")) {
      setThinking(message.content.split("</think>")[0]);
      setActualResponse(message.content.split("</think>")[1]);
    } else {
      setActualResponse(message.content);
    }
  });
  return (
    <div
      key={message.chatId}
      className={`flex flex-col ${
        message.role === "user" ? "items-end" : "justify-star"
      }`}
      ref={chatRef}
    >
      <div
        className={` max-w-fit ${
          message.role === "user" ? "max-w-[500px] w-full" : ""
        } w-full rounded-lg px-4 py-2  ${
          message.role === "user"
            ? "bg-blue-500 text-white rounded-br-none "
            : "bg-inherit text-gray-800 rounded-bl-none"
        }`}
      >
        {thinking && (
          <Collapsible defaultOpen={false} className="group/collapsible">
            <CollapsibleTrigger className="flex gap-2 pb-2 text-[14px] text-zinc-500 cursor-pointer">
              <span>thinking...</span>
              <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90 w-[20px]" />
            </CollapsibleTrigger>
            <CollapsibleContent className="pb-3 text-[14px] text-zinc-500">
              {thinking}
            </CollapsibleContent>
          </Collapsible>
        )}
        <Markdown>{actualResponse}</Markdown>
      </div>

      <ChatActionsBtns
        message={actualResponse}
        className={`${
          index + 1 === totalChats && !isLLmResponseLoading && "mb-30"
        }`}
      />
    </div>
  );
};

export default Chat;
// This component is responsible for rendering individual chat messages in the chat UI. It takes a message object, its index, and the total number of chats as props. The component uses conditional rendering to apply different styles based on the role of the message (user or assistant) and its position in the chat history. The messages are displayed in a flex container to align them correctly based on their sender.
// It uses the `react-markdown` library to render the message content, allowing for rich text formatting. The component is used within the `ChatContainer` component to display the chat history in a scrollable container.
