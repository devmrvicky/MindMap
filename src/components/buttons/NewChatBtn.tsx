import { PenLine } from "lucide-react";
import { useNavigate } from "react-router";
import { useChatRoomStore, useChatStore } from "@/zustand/store";
import { Button } from "../ui/button";
import useKeyboardShortcut from "@/hooks/useKeyboardShortcut";
import { useCallback } from "react";

const NewChatBtn = () => {
  const navigate = useNavigate();
  const setCurrentChatsHistory = useChatStore(
    (store) => store.setCurrentChatsHistory
  );
  const setActiveChatRoom = useChatRoomStore(
    (store) => store.setActiveChatRoom
  );

  // Keyboard shortcut: Ctrl + /
  useKeyboardShortcut(["ctrl", "/"], () => {
    handleClickOnNewChatButton();
  });

  const handleClickOnNewChatButton = useCallback(() => {
    setCurrentChatsHistory([]); // Reset the active chat room to null
    navigate("/");
    setActiveChatRoom(null);
  }, [navigate, setActiveChatRoom, setCurrentChatsHistory]);

  return (
    <Button
      variant="ghost"
      className="cursor-pointer active:scale-90 transition-transform duration-200 bg-zinc-400/10 hover:bg-zinc-400/20 text-zinc-600 dark:text-white hover:text-zinc-900"
      onClick={handleClickOnNewChatButton}
    >
      <PenLine /> New chat
    </Button>
  );
};

export default NewChatBtn;
