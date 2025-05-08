import { useChatStore } from "@/zustand/store";
// import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import useLLMRequest from "@/hooks/useLLMREquest";
import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

const ChatInput = () => {
  const [prompt, setPrompt] = useState<string>("");
  const isMobile = useIsMobile();

  const { getLLMResponse } = useLLMRequest();
  const { currentChatsHistory } = useChatStore((state) => state);
  //  const currentChatsHistory = activeChatRoom?.chats || [];

  const handleSendChatRequest = async (prompt: string) => {
    try {
      await getLLMResponse(prompt);
    } catch (error) {
      console.error("Error sending chat request:", error);
      // Handle error appropriately, e.g., show a notification to the user
    }
  };

  return (
    <div
      className={` max-w-[700px] w-full rounded-2xl my-3 flex items-center justify-center ${
        currentChatsHistory.length > 0
          ? `absolute max-w-[500px] w-full bottom-0 left-1/2 transform -translate-x-1/2 z-50`
          : ""
      }`}
    >
      {/* <Input
        type="text"
        placeholder="Ask me anything..."
        className="border-none focus-visible:ring-0 focus-visible:outline-none focus-visible:ring-transparent p-6 py-8 inline-block placeholder:text-2xl placeholder:text-muted-foreground text-2xl"
        autoFocus
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && prompt.trim()) {
            handleSendChatRequest(prompt);
            setPrompt("");
          }
        }}
      /> */}
      <Textarea
        placeholder="Ask me anything..."
        className="rounded-2xl h-[100px] w-[95%] shadow-2xl"
        autoFocus
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey && prompt.trim()) {
            handleSendChatRequest(prompt);
            setPrompt("");
            e.currentTarget.blur(); // Remove focus from the input after sending
          } else if (e.key === "Enter" && e.shiftKey) {
            e.preventDefault();
            setPrompt((prev) => prev + "\n");
          }
        }}
      />
    </div>
  );
};

export default ChatInput;
// This component is responsible for rendering the chat input field where users can type their messages. It uses Zustand for state management and handles sending the chat request to the LLM API.
