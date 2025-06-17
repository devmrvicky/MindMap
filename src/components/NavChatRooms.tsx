import { LoaderCircle, MoreHorizontal, Trash2 } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  // DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarGroup,
  // SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useChatStore } from "@/zustand/store";
import { useNavigate, useParams } from "react-router";
import useDeleteData from "@/hooks/useDeleteData";
import { useState } from "react";

export function NavChatRooms() {
  const [targetChatRoomId, setTargetChatRoomId] = useState<string | null>(null);
  const { isMobile } = useSidebar();
  const { chatRooms, isChatRoomsFetching } = useChatStore((store) => store);

  const { deleteChatRoom, deleting } = useDeleteData();

  const navigate = useNavigate();
  const { chatRoomId } = useParams();

  const handleClickOnChatRoom = (id: string) => {
    navigate(`/c/${id}`);
  };

  const handleDeleteChatRoom = async (
    e: React.MouseEvent<HTMLDivElement>,
    id: string
  ): Promise<void> => {
    e.stopPropagation();
    setTargetChatRoomId(id);
    await deleteChatRoom({ chatRoomIds: [id] });
  };

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      {/* <SidebarGroupLabel>Projects</SidebarGroupLabel> */}
      <SidebarMenu>
        {!isChatRoomsFetching
          ? chatRooms.length
            ? chatRooms.map((chatRoom) => (
                <SidebarMenuItem
                  key={chatRoom.chatRoomId}
                  onClick={() => handleClickOnChatRoom(chatRoom.chatRoomId)}
                  className={`cursor-pointer flex items-center gap-2 ${
                    chatRoomId === chatRoom.chatRoomId
                      ? "bg-sidebar-accent"
                      : ""
                  }`}
                >
                  <SidebarMenuButton asChild className="w-[85%]">
                    <span className="truncate" title={chatRoom.chatRoomName}>
                      {chatRoom.chatRoomName}
                    </span>
                  </SidebarMenuButton>
                  {deleting && targetChatRoomId === chatRoom.chatRoomId ? (
                    <LoaderCircle className=" w-4 h-4 animate-spin" />
                  ) : (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <SidebarMenuAction
                          showOnHover
                          className="cursor-pointer"
                        >
                          <MoreHorizontal />
                          <span className="sr-only">More</span>
                        </SidebarMenuAction>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        className="w-auto rounded-lg"
                        side={isMobile ? "bottom" : "right"}
                        align={isMobile ? "end" : "start"}
                      >
                        <DropdownMenuItem
                          variant="destructive"
                          onClick={(e) =>
                            handleDeleteChatRoom(e, chatRoom.chatRoomId)
                          }
                        >
                          <Trash2 className="text-muted-foreground" />
                          <span>Delete</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </SidebarMenuItem>
              ))
            : "No chat found"
          : "loading..."}
        {/* <SidebarMenuItem>
          <SidebarMenuButton className="text-sidebar-foreground/70">
            <MoreHorizontal className="text-sidebar-foreground/70" />
            <span>More</span>
          </SidebarMenuButton>
        </SidebarMenuItem> */}
      </SidebarMenu>
    </SidebarGroup>
  );
}
