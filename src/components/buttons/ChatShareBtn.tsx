import { Button } from "../ui/button";
import { exportTextAsPDF, shareText } from "../../handlers/handleShares";
import { Dispatch, SetStateAction, useState } from "react";
import { Share2, DownloadIcon, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { saveChatAsPDF } from "@/handlers/handleChatSave";
import { toast } from "react-toastify";
import Popup from "../utils/Popup";

type FileType = "PDF" | "docs" | "text";
interface ChatShareBtnProps {
  className?: string;
  chat: string;
}
const ChatShareBtn = ({ className, chat }: ChatShareBtnProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentFileType, setCurrentFileType] = useState<FileType>("text");

  const openDialog = () => setIsOpen(true);

  const handleSaveChat = () => {
    if (!currentFileType) return;
    if (currentFileType === "PDF") {
      saveChatAsPDF({ text: chat, filename: chat.slice(0, 5) });
      return;
    }
    toast.info(`download for ${currentFileType} file in dev.`);
  };

  const handleShareChat = () => {
    if (!currentFileType) return;
    if (currentFileType === "text") {
      shareText({ text: chat });
      return;
    } else if (currentFileType === "PDF") {
      exportTextAsPDF({ text: chat, filename: chat.slice(0, 5) });
      return;
    }
    toast.info(`share for ${currentFileType} file in dev.`);
  };

  return (
    <Popup open={isOpen} setOpen={setIsOpen} popupTitle="Share Chat">
      <Button
        variant="ghost"
        size="icon"
        onClick={openDialog}
        className={`cursor-pointer ${className} active:bg-[#000000]/50`}
      >
        <Share2 />
      </Button>
      <div className="flex flex-col gap-6 items-center justify-center">
        <div className="flex gap-2 items-center">
          <span className="w-full">Share Chat as </span>
          <ShareChatFilesOption
            currentFileType={currentFileType}
            setCurrentFileType={setCurrentFileType}
          />
        </div>
        <div className="flex items-center gap-4 justify-center w-full">
          <Button
            className="flex items-center gap-2 text-zinc-500 rounded-full hover:text-zinc-300 cursor-pointer text-sm"
            variant="outline"
            onClick={handleSaveChat}
          >
            <DownloadIcon className="w-4 h-4" />
            <span>save as {currentFileType}</span>
          </Button>
          <Button
            className="flex items-center gap-2 text-zinc-500 rounded-full hover:text-zinc-300 cursor-pointer text-sm"
            variant="outline"
            onClick={handleShareChat}
          >
            <Share2 className="w-4 h-4" />
            <span>share as {currentFileType}</span>
          </Button>
        </div>
      </div>
    </Popup>
  );
};

interface ShareChatFilesOptionProps {
  currentFileType: FileType;
  setCurrentFileType: Dispatch<SetStateAction<FileType>>;
}

const fileTypes = ["PDF", "text", "docs"];

// share file options
const ShareChatFilesOption = ({
  currentFileType,
  setCurrentFileType,
}: ShareChatFilesOptionProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="btn btn-secondary btn-sm">
        <Button
          variant="outline"
          className="border-none cursor-pointer flex items-center justify-between gap-2 w-fit md:w-full"
          title="change model"
        >
          <span className="line-clamp-1 text-nowrap overflow-x-hidden whitespace-nowrap text-ellipsis">
            {["PDF", "text", "docs"].find(
              (fileType) => fileType === currentFileType
            )}
          </span>
          <ChevronDown size={20} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {fileTypes.map((fileType) => (
          <DropdownMenuItem
            key={fileType}
            defaultChecked={fileType === currentFileType}
            onClick={() => {
              setCurrentFileType(fileType as FileType);
            }}
            // defaultValue=
          >
            {fileType}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ChatShareBtn;
