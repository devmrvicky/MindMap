import { AppSidebar } from "@/components/AppSidebar";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import ChatUI from "../../../components/chat-ui/ChatUI";
import { ModelSwitcher } from "../../../components/ModelSwitcher";
import SignupPageNavigationBtn from "../../../components/buttons/auth/SignupPageNavigationBtn";
import LoginPageNavigationBtn from "../../../components/buttons/auth/LoginPageNavigationBtn";
import { useAuthStore } from "@/zustand/store";

export default function MainAside() {
  const { user } = useAuthStore((store) => store);
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 p-2">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            {/* here was bradcrumb */}
            <ModelSwitcher />
          </div>
          <div className="ml-auto flex items-center gap-2 pr-4">
            {user ? (
              ""
            ) : (
              <>
                <LoginPageNavigationBtn />
                <SignupPageNavigationBtn />
              </>
            )}
          </div>
        </header>
        {/* here is actual app ui */}
        <ChatUI />
      </SidebarInset>
    </SidebarProvider>
  );
}
