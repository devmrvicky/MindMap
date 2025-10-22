import { ChevronDown, RefreshCcw } from "lucide-react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useChatStore, useModelStore } from "@/zustand/store";
import { toast } from "react-toastify";
import useLLMRequest from "@/hooks/useLLMREquest";
import { AxiosError } from "axios";

const RegenerateResBtn = () => {
  const setIsResponseLoading = useModelStore(
    (store) => store.setIsResponseLoading
  );
  const currentChatsHistory = useChatStore((s) => s.currentChatsHistory);
  const chat: string = currentChatsHistory.at(-1)?.content[0].content || "";
  const { getLLMResponse } = useLLMRequest();

  const handleRegenerateErrorResponse = async (model?: string) => {
    try {
      if (!chat.trim()) return;
      setIsResponseLoading(true);
      await getLLMResponse({
        prompt: chat.trim(),
        model,
        isRegeneratingErrorResponse: true,
      });
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message);
      }
      console.error("Error sending chat request:", error);
    }
  };

  return (
    <div className="flex items-center justify-center border rounded-2xl max-w-fit ">
      <Button
        variant="ghost"
        className=""
        title="Regenerate Response"
        onClick={() => handleRegenerateErrorResponse(chat)}
      >
        <RefreshCcw />
      </Button>
      <ChooseModel
        handleRegenerateErrorResponse={handleRegenerateErrorResponse}
      />
    </div>
  );
};

const ChooseModel = ({
  // model,
  handleRegenerateErrorResponse,
}: {
  // model?: string;
  handleRegenerateErrorResponse: (changedModel?: Model["id"]) => void;
}) => {
  const chatModels = useModelStore((state) => state.chatModels);
  const currentLLMModel = useModelStore((state) => state.currentLLMModel);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="btn btn-secondary btn-sm">
        <Button
          variant="outline"
          className="border-none cursor-pointer flex items-center justify-between gap-2 w-[200px] md:w-full"
          title="change model"
        >
          <span className="line-clamp-1 text-nowrap overflow-x-hidden whitespace-nowrap text-ellipsis">
            {/* {chatModels.find((chatModel) => chatModel.id === model)?.name ??
            model
              ? model
              : currentLLMModel.name} */}
            {currentLLMModel.name}
          </span>
          <ChevronDown size={20} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {chatModels.map((chatModel) => (
          <DropdownMenuItem
            key={chatModel.name}
            // defaultChecked={chatModel.id === model}
            onClick={() => {
              // changeCurrentLLMModel(chatModel.model);
              handleRegenerateErrorResponse(chatModel.id);
            }}
            // defaultValue=
          >
            {chatModel.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default RegenerateResBtn;
