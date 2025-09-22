import { AppSidebar } from "@/components/AppSidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import ChatUI from "../../components/chat-ui/ChatUI";
import { useMemo } from "react";
import ChatUIHeader from "@/components/chat-ui/ChatUIHeader";

export default function MainAside() {
  const MemoChatUI = useMemo(() => <ChatUI />, []);
  const MemoChatUIHeader = useMemo(() => <ChatUIHeader />, []);

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        {MemoChatUIHeader}
        {/* here is actual app ui */}
        {MemoChatUI}
      </SidebarInset>
    </SidebarProvider>
  );
}
