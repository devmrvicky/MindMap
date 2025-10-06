// import { Globe } from "lucide-react";
// import { Button } from "./ui/button";
import MicBtn from "./buttons/MicBtn";
import ImgCreationToogleBtn from "./buttons/ImgCreationToggleBtn";
import FileUploadBtn from "./buttons/FileUploadBtn";
import { AbortControllerBtn } from "./buttons/AbortControllerBtn";
import SendLlmRequestBtn from "./buttons/sendLlmRequestBtn";
import { useModelStore } from "@/zustand/store";

const ChatInputToolsBtn = ({
  prompt,
  setPrompt,
  setWantToImgUpload,
}: {
  prompt: string;
  setPrompt: React.Dispatch<React.SetStateAction<string>>;
  setWantToImgUpload: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const isResponseLoading = useModelStore((store) => store.isResponseLoading);

  return (
    <div className="flex items-center justify-center gap-1 w-full">
      <FileUploadBtn setWantToImgUpload={setWantToImgUpload} />
      {/* image creation button */}
      <ImgCreationToogleBtn />
      {/* mice button */}
      <MicBtn setPrompt={setPrompt} />
      <div className="ml-auto">
        {isResponseLoading ? (
          <AbortControllerBtn />
        ) : (
          <SendLlmRequestBtn prompt={prompt} setPrompt={setPrompt} />
        )}
      </div>
    </div>
  );
};

export default ChatInputToolsBtn;
