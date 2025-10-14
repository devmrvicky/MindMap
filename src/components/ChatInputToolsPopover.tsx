import { Plus } from "lucide-react";
import ChatInputToolsBtn from "./ChatInputToolsBtn";
import { Button } from "./ui/button";
import { useState } from "react";
import PopoverUtil from "./utils/popovers/Popover-util";

const ChatInputToolsPopover = ({
  setWantToImgUpload,
  className,
}: {
  setWantToImgUpload: React.Dispatch<React.SetStateAction<boolean>>;
  className: string;
}) => {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <PopoverUtil open={open} setOpen={setOpen}>
      <Button
        variant="secondary"
        className={`border rounded-full w-10 h-10 flex items-center justify-center cursor-pointer ${className}`}
      >
        <Plus />
      </Button>
      <div className="w-[200px] h-auto flex flex-col gap-2">
        <ChatInputToolsBtn setWantToImgUpload={setWantToImgUpload} />
      </div>
    </PopoverUtil>
  );
};

export default ChatInputToolsPopover;
