import Markdown from "react-markdown";
import { RefObject, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Collapsible } from "@radix-ui/react-collapsible";
import { CollapsibleContent, CollapsibleTrigger } from "../ui/collapsible";
import ChatActionsBtns from "../ChatActionsBtns";
import ImgPopup from "../utils/ImgPopup";
import { Button } from "../ui/button";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css"; // Or any highlight.js theme

const Chat = ({
  message,
  index,
  totalChats,
  isLLmResponseLoading,
  chatRef,
  errorRes,
}: {
  message: Chat;
  index: number;
  totalChats: number;
  isLLmResponseLoading: boolean;
  chatRef: RefObject<HTMLDivElement | null>;
  errorRes: boolean;
}) => {
  const [thinking, setThinking] = useState<string | null>(null);
  const [actualResponse, setActualResponse] = useState<string>("");
  const [chatType, setChatType] = useState<"text" | "image">("text");
  const [isTruncated, setIsTruncated] = useState<boolean>(false);
  const [noOfResponses, setNoOfResponses] = useState<number>(
    message.content.length
  );
  const [currentActiveTabNo, setCurrentActiveTabNo] = useState<number>(1);

  function getThinkingAndResponse(
    content: string,
    role: "user" | "assistant",
    str: string
  ) {
    if (role === "assistant" && content.includes(str)) {
      let thinkingText = content.split(str)[0].replace(/^<think>|^◁think▷/, "");
      // thinkingText = thinkingText.replace(/^<think>|^◁think▷/, "");
      setThinking(thinkingText);
      setActualResponse(content.split(str)[1]);
    }
  }

  const handleChangeTab = (activeTabNo: number) => {
    if (activeTabNo < 1 || activeTabNo > noOfResponses) return;
    setCurrentActiveTabNo(activeTabNo);
    // setTabValue("response_" + activeTabNo);
  };

  useEffect(() => {
    if (message.content[currentActiveTabNo - 1].content.includes("</think>")) {
      getThinkingAndResponse(
        message.content[currentActiveTabNo - 1].content,
        message.role,
        "</think>"
      );
    } else if (
      message.content[currentActiveTabNo - 1].content.includes("◁/think▷")
    ) {
      getThinkingAndResponse(
        message.content[currentActiveTabNo - 1].content,
        message.role,
        "◁/think▷"
      );
    } else {
      setActualResponse(message.content[0].content);
    }
  }, [message.content, message.role, currentActiveTabNo]);

  useEffect(() => {
    const imageUrlRegex =
      /^https:\/\/pictures-storage\.storage\.eu-north1\.nebius\.cloud\/.*\.webp$/;
    if (imageUrlRegex.test(message.content[0].content)) {
      setChatType("image");
    } else {
      setChatType("text");
    }
    setNoOfResponses(message.content.length);
  }, [message.content.length, message.content[0].content]);

  return (
    <div
      key={message.chatId}
      className={`flex flex-col py-1 ${
        message.role === "user" ? "items-end" : "justify-star"
      }`}
      ref={chatRef}
    >
      {message.role === "user" ? (
        <div
          className={`max-w-fit w-[400px] rounded-lg px-4 py-2  bg-blue-500 dark:bg-zinc-800 text-white rounded-br-none`}
        >
          {actualResponse.length > 200 ? (
            <div
              className="cursor-pointer"
              onClick={() => setIsTruncated(!isTruncated)}
            >
              <Markdown>
                {isTruncated
                  ? actualResponse
                  : actualResponse.slice(0, 200) + "..."}
              </Markdown>
            </div>
          ) : (
            <Markdown>{actualResponse}</Markdown>
          )}
        </div>
      ) : (
        <>
          {noOfResponses >= 1 && (
            <div className="flex items-center justify-between max-w-fit">
              <Button
                variant="outline"
                className="border-none"
                onClick={() => handleChangeTab(currentActiveTabNo - 1)}
              >
                <ChevronLeft size={20} className="mr-2" />
              </Button>
              <p>
                {currentActiveTabNo}/{noOfResponses}
              </p>
              <Button
                variant="outline"
                className="border-none"
                onClick={() => handleChangeTab(currentActiveTabNo + 1)}
              >
                <ChevronRight size={20} className="mr-2" />
              </Button>
            </div>
          )}
          <div
            className={`w-full rounded-lg px-4 py-2 bg-inherit text-gray-800 rounded-bl-none dark:text-zinc-300`}
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
            {chatType === "text" ? (
              // <Markdown>{actualResponse}</Markdown>
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeHighlight]}
              >
                {actualResponse}
              </ReactMarkdown>
            ) : (
              <ImgPopup
                src={actualResponse}
                className="w-full h-auto rounded-lg"
                prompt={""}
              />
            )}
          </div>
        </>
      )}
      {chatType === "text" && (
        <ChatActionsBtns
          message={actualResponse}
          role={message.role}
          chatId={message.chatId}
          model={message.content[currentActiveTabNo - 1].model}
          className={`${
            index + 1 === totalChats &&
            !isLLmResponseLoading &&
            !errorRes &&
            "mb-30"
          }`}
        />
      )}
    </div>
  );
};

export default Chat;
// This component is responsible for rendering individual chat messages in the chat UI. It takes a message object, its index, and the total number of chats as props. The component uses conditional rendering to apply different styles based on the role of the message (user or assistant) and its position in the chat history. The messages are displayed in a flex container to align them correctly based on their sender.
// It uses the `react-markdown` library to render the message content, allowing for rich text formatting. The component is used within the `ChatContainer` component to display the chat history in a scrollable container.
