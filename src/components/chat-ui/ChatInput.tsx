import { useChatStore } from "@/zustand/store";
import { Input } from "@/components/ui/input";
import useLLMRequest from "@/hooks/useLLMREquest";
import { useState } from "react";

const ChatInput = () => {
  const [prompt, setPrompt] = useState<string>("");

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
      className={`border max-w-[700px] w-full rounded-2xl overflow-hidden my-3 bg-white shadow-2xl ${
        currentChatsHistory.length > 0
          ? "fixed max-w-[500px] w-full bottom-7"
          : ""
      }`}
    >
      <Input
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
      />
    </div>
  );
};

export default ChatInput;
// This component is responsible for rendering the chat input field where users can type their messages. It uses Zustand for state management and handles sending the chat request to the LLM API.
