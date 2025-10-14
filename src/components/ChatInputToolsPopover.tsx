import { Plus } from "lucide-react";
import ChatInputToolsBtn from "./ChatInputToolsBtn";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";

const ChatInputToolsPopover = ({
  setWantToImgUpload,
  className,
}: {
  setWantToImgUpload: React.Dispatch<React.SetStateAction<boolean>>;
  className: string;
}) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="secondary"
          className={`border rounded-full w-10 h-10 flex items-center justify-center cursor-pointer ${className}`}
        >
          <Plus />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="w-[200px] h-auto flex flex-col gap-2"
      >
        <ChatInputToolsBtn setWantToImgUpload={setWantToImgUpload} />
      </PopoverContent>
    </Popover>
  );
};

export default ChatInputToolsPopover;
