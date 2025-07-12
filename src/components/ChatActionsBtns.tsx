import SpeekBtn from "./buttons/SpeekBtn";
import CopyBtn from "./buttons/CopyBtn";
import RegenerateResBtn from "./buttons/RegenerateResBtn";

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
      className={`flex items-center gap-2 bg-transparent rounded-2xl mt-2 ${className}`}
    >
      <CopyBtn text={message} />
      {role === "assistant" && (
        <RegenerateResBtn chatId={chatId} model={model} />
      )}
      <SpeekBtn text={message} />
    </div>
  );
};

export default ChatActionsBtns;
