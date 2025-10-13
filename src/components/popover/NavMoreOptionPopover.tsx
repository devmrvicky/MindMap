import LoginPageNavigationBtn from "../buttons/auth/LoginPageNavigationBtn";
import SignupPageNavigationBtn from "../buttons/auth/SignupPageNavigationBtn";
import ChatRoomShareBtn from "../buttons/ChatRoomShareBtn";
import UserQueryListPopup from "../chat-ui/UserQueryListPopup";
import MoreOptionPopover from "./MoreOptionPopover";

const NavMoreOptionPopover = ({
  isUserExist,
  currentChatsHistory,
}: {
  isUserExist: boolean;
  currentChatsHistory: Chat[];
}) => {
  return (
    <MoreOptionPopover>
      <div className="w-full flex flex-col gap-2">
        <span className="text-xs text-zinc-500 italic">Options</span>
        <UserQueryListPopup
          userQueries={currentChatsHistory
            .filter((chat) => chat.role === "user")
            .map((chat) => chat.content[0].content)}
        />
        {!isUserExist ? (
          <div className="flex items-center justify-center gap-3 pt-2 border-t">
            <LoginPageNavigationBtn />
            <SignupPageNavigationBtn />
          </div>
        ) : (
          currentChatsHistory.length > 0 && <ChatRoomShareBtn />
        )}
      </div>
    </MoreOptionPopover>
  );
};

export default NavMoreOptionPopover;
