import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { useState } from "react";
import { Loader, Share } from "lucide-react";
import CopyBtn from "./CopyBtn";
import ShareBtn from "./ShareBtn";
import { chatRoomService } from "@/services/chatRoomService";
import { env } from "@/env/env";
import { useParams } from "react-router";

interface ChatRoomShareBtnProps {
  className?: string;
}
const ChatRoomShareBtn = ({ className }: ChatRoomShareBtnProps) => {
  const [creatingLink, setCreatingLink] = useState<boolean>(false);
  const [link, setLink] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const openDialog = () => setIsOpen(true);

  const { chatRoomId } = useParams();

  const createSharedChatRoomLink = async () => {
    try {
      if (!chatRoomId) return;
      setCreatingLink(true);
      const response = await chatRoomService.createSharedChatRoom({
        chatRoomId,
      });
      setLink(`${env.VITE_CLIENT_URL}/share/${response.chatRoomId}`);
    } catch {
      console.error("Error creating shared chat room link");
    } finally {
      setCreatingLink(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          onClick={openDialog}
          className={`cursor-pointer ${className} backdrop-blur-2xl bg-[#000000]/50 min-[520px]:w-[80px] px-2 min-[520px]:rounded-3xl`}
        >
          <Share />
          <span className="min-[520px]:inline hidden ">share</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="p-4 flex flex-col">
        <DialogTitle>Share options</DialogTitle>
        <p>Share the chat room link</p>
        <div className="border border-zinc-300 rounded-full px-5  h-[80px] flex items-center justify-center related">
          <p className="  line-clamp-1 text-nowrap overflow-x-hidden whitespace-nowrap text-ellipsis">
            {creatingLink ? (
              <Loader className="animate-spin duration-75" />
            ) : link ? (
              link
            ) : (
              "create shared chatroom link"
            )}
          </p>
        </div>
        <div
          className={`flex w-full flex-row items-center justify-center gap-4 py-3 pt-2`}
        >
          {link ? (
            <>
              {" "}
              <CopyBtn text={link} />
              <ShareBtn url={link} />
            </>
          ) : (
            <Button
              variant={"outline"}
              className="rounded-3xl px-3 py-2 cursor-pointer"
              onClick={createSharedChatRoomLink}
              disabled={creatingLink}
            >
              Generate link
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ChatRoomShareBtn;
