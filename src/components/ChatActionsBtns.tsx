import SpeekBtn from "./buttons/SpeekBtn";
import CopyBtn from "./buttons/CopyBtn";
import RegenerateResBtn from "./buttons/RegenerateResBtn";
import { extractRawTextFromMarkdown } from "@/tool-methods/extractRawTextFromMd";
import ChatShareBtn from "./buttons/ChatShareBtn";
import MoreOptionPopover from "./popover/MoreOptionPopover";

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
      className={`flex items-center gap-2 bg-transparent rounded-2xl p-0 min-[520px]:px-4 overflow-x-auto ${className}`}
    >
      <CopyBtn text={message} />
      {role === "assistant" && <ChatShareBtn chat={message} />}
      <SpeekBtn text={extractRawTextFromMarkdown(message)} />
      {/* more option button */}
      {role === "assistant" && (
        <MoreOptionPopover>
          <RegenerateResBtn chatId={chatId} model={model} />
        </MoreOptionPopover>
      )}
    </div>
  );
};

export default ChatActionsBtns;
