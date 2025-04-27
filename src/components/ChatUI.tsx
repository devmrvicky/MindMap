import { Input } from "@/components/ui/input";
import { useState } from "react";
import Markdown from "react-markdown";

const ChatUI = () => {
  const [waiting, setWaiting] = useState<boolean>(false);
  const [prompt, setPrompt] = useState<string>("");
  const [chats, setChats] = useState<{ role: string; content: string }[]>([]);

  async function handleSendChatRequest() {
    try {
      setWaiting(true);
      setChats((prev) => [...prev, { role: "user", content: prompt }]);
      setPrompt(""); // Clear the input field after sending the message
      const response = await fetch("http://localhost:3000/generate-response", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: prompt }),
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setChats((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.response.choices[0].message.content,
        },
      ]);
      console.log(data); // Handle the response data as needed
    } catch (error) {
      console.error("Error:", error); // Handle the error as needed
    } finally {
      setWaiting(false);
    }
  }

  return (
    <div className="flex flex-col h-screen p-4 bg-gray-100 max-w-[700px] mx-auto">
      <div className="flex-grow overflow-y-auto p-4 bg-white rounded-lg shadow-md">
        {/* chat ui */}
        {chats.map((chat, index) => (
          <div
            key={index}
            className={`mb-4 ${
              chat.role === "user" ? "text-right" : "text-left"
            }`}
          >
            <div
              className={`inline-block p-2 rounded-lg ${
                chat.role === "user"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-black"
              }`}
            >
              <Markdown>{chat.content}</Markdown>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 flex items-center">
        <Input
          type="text"
          placeholder="Type your message..."
          className="flex-grow mr-2"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded-lg"
          onClick={handleSendChatRequest}
          disabled={waiting}
        >
          {waiting ? "Sending..." : "Send"}
        </button>
      </div>
    </div>
  );
};

export default ChatUI;
