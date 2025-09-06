import { ChevronDown, RefreshCcw } from "lucide-react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useModelStore } from "@/zustand/store";
import { toast } from "react-toastify";

const RegenerateResBtn = ({
  chatId,
  errorRes,
  model,
}: {
  chatId?: Chat["chatId"];
  errorRes?: boolean;
  model?: string;
}) => {
  const { currentLLMModel } = useModelStore((state) => state);
  const handleRegenerate = () => {
    toast.warn(
      "This feature is under development, please wait for the next update.",
      {
        toastId: "regenerate-res-btn",
      }
    );
    console.log(chatId, errorRes, model);
    return;
  };

  // const { getLLMRegeneratedResponse, getLLMResponse } = useLLMRequest();

  // const handleRegenerate = (changedModel?: Partial<Model>) => {
  //   toast.info(
  //     "this feature is under development, please wait for the next update",
  //     {
  //       toastId: "regenerate-res-btn",
  //     }
  //   );
  //   return;
  //   if (changedModel) setCurrentUsedModel(changedModel);
  //   const indexOfResThatRegenerate = !errorRes
  //     ? currentChatsHistory.findIndex((chat) => chat.chatId === chatId)
  //     : currentChatsHistory.length - 1;
  //   if (indexOfResThatRegenerate === -1) {
  //     console.error("Response ID not found in chat history");
  //     return;
  //   }
  //   const query = errorRes
  //     ? currentChatsHistory[indexOfResThatRegenerate].content[0].content
  //     : currentChatsHistory[indexOfResThatRegenerate - 1].content[0].content;
  //   if (!errorRes) {
  //     // console.log(currentChatsHistory.slice(0, indexOfResThatRegenerate - 1));
  //     // return;
  //     getLLMRegeneratedResponse({
  //       chatId: chatId || "",
  //       query,
  //       model: " changedModel.id || currentUsedModel.id || currentLLMModel.id",
  //       prevResponse: currentChatsHistory
  //         .slice(0, indexOfResThatRegenerate - 1)
  //         .slice(-5),
  //     });
  //   } else {
  //     getLLMResponse(query);
  //   }
  //   console.log(
  //     `Regenerating response for query: ${query} with model: ${
  //       changedModel || currentUsedModel
  //     }`
  //   );
  // };

  return (
    <div className="flex items-center justify-center border rounded-2xl max-w-fit">
      <Button
        variant="outline"
        className="btn btn-secondary btn-sm cursor-pointer border-none"
        title="Regenerate Response"
        // onClick={() => handleRegenerate()}
      >
        <RefreshCcw size={20} />
      </Button>
      <ChooseModel
        model={currentLLMModel}
        handleRegenerate={handleRegenerate}
      />
    </div>
  );
};

const ChooseModel = ({
  model,
  handleRegenerate,
}: {
  model: Partial<Model>;
  handleRegenerate: (changedModel?: Partial<Model>) => void;
}) => {
  const { chatModels } = useModelStore((state) => state);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="btn btn-secondary btn-sm">
        <Button
          variant="outline"
          className="border-none cursor-pointer flex items-center justify-between gap-2"
          title="change model"
        >
          <span>
            {chatModels.find((chatModel) => chatModel.id === model.id)?.name ??
              "Unknown Model"}
          </span>
          <ChevronDown size={20} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {chatModels.map((chatModel) => (
          <DropdownMenuItem
            key={chatModel.name}
            defaultChecked={chatModel.id === model.id}
            onClick={() => {
              // changeCurrentLLMModel(chatModel.model);
              handleRegenerate(chatModel);
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
