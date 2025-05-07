import * as React from "react";
import { AudioWaveform, ChevronsUpDown } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useChatStore } from "@/zustand/store";

export function ModelSwitcher() {
  const { isMobile } = useSidebar();

  const { models, changeCurrentLLMModel } = useChatStore((state) => state);
  const [activeModel, setActiveModel] = React.useState(models[0]);
  // console.log(activeModel);

  React.useEffect(() => {
    if (activeModel) {
      changeCurrentLLMModel(activeModel.model);
    }
  }, [activeModel, changeCurrentLLMModel]);

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <AudioWaveform className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  {activeModel.name}
                </span>
                {/* <span className="truncate text-xs">{activeTeam.plan}</span> */}
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              models
            </DropdownMenuLabel>
            {models.map((model) => (
              <DropdownMenuItem
                key={model.name}
                onClick={() => setActiveModel(model)}
                className="gap-2 p-2 border hover:bg-sidebar-accent hover:text-sidebar-accent-foreground cursor-pointer my-1 flex"
                disabled={model.name === activeModel.name}
                // onChange={}
              >
                <div className="flex size-6 items-center justify-center rounded-sm border">
                  <AudioWaveform className="size-4 shrink-0" />
                </div>
                {model.name}
                {/* <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut> */}
                {model.label === "paid" && (
                  <p className="text-right font-medium text-yellow-400 ml-auto">
                    pro
                  </p>
                )}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
