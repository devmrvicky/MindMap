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
import { useChatStore, useImageStore } from "@/zustand/store";

export function ModelSwitcher() {
  const { chatModels, changeCurrentLLMModel, imageModels, currentLLMModel } =
    useChatStore((state) => state);
  // const [models, setModels] = React.useState(() => [...chatModels]);
  const { isMobile } = useSidebar();
  // console.log(chatModels);
  const [activeModel, setActiveModel] = React.useState(currentLLMModel);

  const { imageGenerationOn } = useImageStore((store) => store);
  // console.log(activeModel);

  React.useEffect(() => {
    if (activeModel) {
      changeCurrentLLMModel(activeModel);
    }
  }, [activeModel, changeCurrentLLMModel]);

  // React.useEffect(() => {
  //   setModels(imageGenerationOn ? imageModels : chatModels);
  // }, [imageGenerationOn]);

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
            {(imageGenerationOn ? imageModels : chatModels).map((model) => (
              <DropdownMenuItem
                key={model.name}
                onClick={() => setActiveModel(model)}
                className="gap-2 p-2 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground cursor-pointer my-1 flex"
                disabled={model.name === activeModel.name}
                // onChange={}
              >
                <div className="flex size-6 items-center justify-center rounded-sm">
                  <AudioWaveform className="size-4 shrink-0" />
                </div>
                {model.id}
                {/* <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut> */}
                {model.label === "paid" && (
                  <p className="text-right font-medium text-yellow-400 ml-auto">
                    pro
                  </p>
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
