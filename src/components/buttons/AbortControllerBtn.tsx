import { Button } from "../ui/button";
import { llmService } from "@/services/llmService";
import { useModelStore } from "@/zustand/store";

// controller: AbortController | null
export const AbortControllerBtn = () => {
  // const cancleRequest = llmService.cancleRequest

  const chatRequestAbortController = useModelStore(
    (store) => store.chatRequestAbortController
  );

  const handleAbortSingle = () => {
    llmService.cancelRequest(chatRequestAbortController as AbortController);
  };

  return (
    <Button
      variant="outline"
      className={`border rounded-full w-10 h-10 flex items-center justify-center mt-2 cursor-pointer"`}
      title="abort request"
      onClick={handleAbortSingle}
    >
      <span className="min-w-[14px] min-h-[14px] bg-white overflow-hidden rounded animate-pulse" />
    </Button>
  );
};
