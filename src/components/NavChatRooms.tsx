import { MoreHorizontal, Trash2 } from "lucide-react";

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

export function NavChatRooms() {
  const { isMobile } = useSidebar();
  const { chatRooms } = useChatStore((store) => store);

  const { deleteChatRoom } = useDeleteData();

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
    await deleteChatRoom({ chatRoomIds: [id] });
  };

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      {/* <SidebarGroupLabel>Projects</SidebarGroupLabel> */}
      <SidebarMenu>
        {chatRooms.length
          ? chatRooms.map((chatRoom) => (
              <SidebarMenuItem
                key={chatRoom.chatRoomId}
                onClick={() => handleClickOnChatRoom(chatRoom.chatRoomId)}
                className={`cursor-pointer ${
                  chatRoomId === chatRoom.chatRoomId ? "bg-sidebar-accent" : ""
                }`}
              >
                <SidebarMenuButton asChild>
                  <span className="truncate" title={chatRoom.chatRoomName}>
                    {chatRoom.chatRoomName}
                  </span>
                </SidebarMenuButton>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <SidebarMenuAction showOnHover>
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
              </SidebarMenuItem>
            ))
          : "No chat found"}
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
