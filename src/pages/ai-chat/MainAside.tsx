import { AppSidebar } from "@/components/AppSidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import ChatUI from "../../components/chat-ui/ChatUI";
import { useMemo, useState } from "react";
import ChatUIHeader from "@/components/chat-ui/ChatUIHeader";
import useBackButtonClose from "@/hooks/useBackButtonClose";

export default function MainAside() {
  const [open, setOpen] = useState<boolean>(true);
  const MemoChatUI = useMemo(() => <ChatUI />, []);
  const MemoChatUIHeader = useMemo(() => <ChatUIHeader />, []);

  useBackButtonClose(open, () => setOpen(false), {});

  return (
    <SidebarProvider open={open} onOpenChange={setOpen}>
      <AppSidebar />
      <SidebarInset>
        {MemoChatUIHeader}
        {/* here is actual app ui */}
        {MemoChatUI}
      </SidebarInset>
    </SidebarProvider>
  );
}
