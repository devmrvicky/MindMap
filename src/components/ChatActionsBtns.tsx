import SpeekBtn from "./buttons/SpeekBtn";
import CopyBtn from "./buttons/CopyBtn";
import RegenerateResBtn from "./buttons/RegenerateResBtn";
import { extractRawTextFromMarkdown } from "@/tool-methods/extractRawTextFromMd";
import ChatShareBtn from "./buttons/ChatShareBtn";
import MoreOptionPopover from "./utils/popovers/MoreOptionPopover";

const ChatActionsBtns = ({
  chat,
  className,
  role,
  model,
}: {
  chat: string;
  className: string;
  role: "user" | "assistant";
  model: string;
}) => {
  return (
    <div
      className={`flex items-center gap-2 bg-transparent rounded-2xl p-0 min-[520px]:px-4 overflow-x-auto h-full ${className}`}
    >
      <CopyBtn text={chat} />
      {role === "assistant" && <ChatShareBtn chat={chat} />}
      <SpeekBtn text={extractRawTextFromMarkdown(chat)} />
      {/* more option button */}
      {role === "assistant" && (
        <MoreOptionPopover>
          <RegenerateResBtn model={model} />
        </MoreOptionPopover>
      )}
    </div>
  );
};

export default ChatActionsBtns;
