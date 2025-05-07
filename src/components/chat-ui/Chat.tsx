import Markdown from "react-markdown";

const Chat = ({
  message,
  index,
  totalChats,
  isLLmResponseLoading,
}: {
  message: Chat;
  index: number;
  totalChats: number;
  isLLmResponseLoading: boolean;
}) => {
  return (
    <div
      key={message.id}
      className={`flex ${
        message.role === "user" ? "justify-end" : "justify-star"
      }`}
    >
      <div
        className={` max-w-fit ${
          message.role === "user" ? "max-w-[500px] w-full" : ""
        } w-full rounded-lg px-4 py-2 ${
          index + 1 === totalChats && !isLLmResponseLoading && "mb-30"
        } ${
          message.role === "user"
            ? "bg-blue-500 text-white rounded-br-none "
            : "bg-inherit text-gray-800 rounded-bl-none"
        }`}
      >
        <Markdown>{message.content}</Markdown>
      </div>
    </div>
  );
};

export default Chat;
// This component is responsible for rendering individual chat messages in the chat UI. It takes a message object, its index, and the total number of chats as props. The component uses conditional rendering to apply different styles based on the role of the message (user or assistant) and its position in the chat history. The messages are displayed in a flex container to align them correctly based on their sender.
// It uses the `react-markdown` library to render the message content, allowing for rich text formatting. The component is used within the `ChatContainer` component to display the chat history in a scrollable container.
