import SpeekBtn from "./buttons/SpeekBtn";
import CopyBtn from "./buttons/CopyBtn";
import RegenerateResBtn from "./buttons/RegenerateResBtn";
import { extractRawTextFromMarkdown } from "@/tool-methods/extractRawTextFromMd";
import ChatShareBtn from "./buttons/ChatShareBtn";

const ChatActionsBtns = ({
  message,
  className,
  role,
  chatId,
  model,
}: {
  message: string;
  className: string;
  role: "user" | "assistant";
  chatId: Chat["chatId"];
  model: string;
}) => {
  return (
    <div
      className={`flex items-center gap-2 bg-transparent rounded-2xl mt-2 overflow-x-auto ${className}`}
    >
      <CopyBtn text={message} />
      {role === "assistant" && (
        <>
          <RegenerateResBtn chatId={chatId} model={model} />
          <ChatShareBtn chat={message} />
        </>
      )}
      <SpeekBtn text={extractRawTextFromMarkdown(message)} />
    </div>
  );
};

export default ChatActionsBtns;
