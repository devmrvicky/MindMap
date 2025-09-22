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
      <ChooseModel model={model} handleRegenerate={handleRegenerate} />
    </div>
  );
};

const ChooseModel = ({
  model,
  handleRegenerate,
}: {
  model?: string;
  handleRegenerate: (changedModel?: Partial<Model>) => void;
}) => {
  const chatModels = useModelStore((state) => state.chatModels);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="btn btn-secondary btn-sm">
        <Button
          variant="outline"
          className="border-none cursor-pointer flex items-center justify-between gap-2"
          title="change model"
        >
          <span>
            {chatModels.find((chatModel) => chatModel.id === model)?.name ??
              model}
          </span>
          <ChevronDown size={20} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {chatModels.map((chatModel) => (
          <DropdownMenuItem
            key={chatModel.name}
            defaultChecked={chatModel.id === model}
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
