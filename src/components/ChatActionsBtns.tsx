import SpeekBtn from "./buttons/SpeekBtn";

const ChatActionsBtns = ({
  message,
  className,
}: {
  message: string;
  className: string;
}) => {
  return (
    <div
      className={`flex items-center gap-2 bg-transparent rounded-2xl mt-2 ${className}`}
    >
      <SpeekBtn text={message} />
    </div>
  );
};

export default ChatActionsBtns;
