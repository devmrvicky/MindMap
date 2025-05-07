import { AppSidebar } from "@/components/AppSidebar";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import ChatUI from "../chat-ui/ChatUI";
import { ModelSwitcher } from "../ModelSwitcher";
// import { TeamSwitcher } from "../ModelSwitcher";

export default function MainAside() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            {/* here was bradcrumb */}
            <ModelSwitcher />
          </div>
        </header>
        {/* here is actual app ui */}
        <ChatUI />
      </SidebarInset>
    </SidebarProvider>
  );
}
