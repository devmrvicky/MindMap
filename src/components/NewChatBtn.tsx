import { PenLine } from "lucide-react";
import { Button } from "./ui/button";
import { useNavigate } from "react-router";
import { useChatStore } from "@/zustand/store";

const NewChatBtn = () => {
  const navigate = useNavigate();
  const { setActiveChatRoom, setCurrentChatsHistory } = useChatStore(
    (store) => store
  );

  const handleClickOnNewChatButton = () => {
    console.log("new chat button clicked");
    navigate("/");
    setActiveChatRoom(null);
    setCurrentChatsHistory([]); // Reset the active chat room to null
  };

  return (
    <Button
      variant="ghost"
      className="cursor-pointer active:scale-90 transition-transform duration-200 bg-zinc-400/10 hover:bg-zinc-400/20 text-zinc-600 hover:text-zinc-900"
      onClick={handleClickOnNewChatButton}
    >
      <PenLine /> New chat
    </Button>
  );
};

export default NewChatBtn;
