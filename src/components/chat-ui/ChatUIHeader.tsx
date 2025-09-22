import { Separator } from "@/components/ui/separator";
import { ModelSwitcher } from "../../components/ModelSwitcher";
import SignupPageNavigationBtn from "../../components/buttons/auth/SignupPageNavigationBtn";
import LoginPageNavigationBtn from "../../components/buttons/auth/LoginPageNavigationBtn";
import { useAuthStore, useChatStore } from "@/zustand/store";
import { useScrollDetection } from "@/hooks/useScrollDetection";
import NewChatBtn from "../buttons/NewChatBtn";
import SidebarButton from "../buttons/SidebarButton";
import { useIsMobile } from "@/hooks/use-mobile";

const ChatUIHeader = () => {
  const user = useAuthStore((store) => store.user);
  const currentChatsHistory = useChatStore((s) => s.currentChatsHistory);
  const { isScrollUp } = useScrollDetection();
  const isMobile = useIsMobile();
  return (
    <header
      className={`flex h-16 shrink-0 items-center gap-2 transition-[width,height,top] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 p-2 ${
        isScrollUp ? "sticky top-0" : "sticky top-[-100px]"
      } bg-white/80 dark:bg-[#171717]/80 backdrop-blur-sm z-10 `}
    >
      <div className="flex items-center gap-2 px-4">
        {/* <SidebarTrigger className="-ml-1" /> */}
        <SidebarButton />
        <Separator orientation="vertical" className="mr-2 h-4" />
        {/* here was bradcrumb */}
        <ModelSwitcher />
      </div>
      <div className="ml-auto flex items-center gap-2 pr-4">
        {isMobile && currentChatsHistory.length > 0 && <NewChatBtn />}
        {!user ? (
          <>
            <LoginPageNavigationBtn />
            <SignupPageNavigationBtn />
          </>
        ) : (
          ""
        )}
      </div>
    </header>
  );
};

export default ChatUIHeader;
