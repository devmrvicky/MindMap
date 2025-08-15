import { Globe } from "lucide-react";
import { Button } from "./ui/button";
import MicBtn from "./buttons/MicBtn";
import ImgCreationToogleBtn from "./buttons/ImgCreationToggleBtn";
import FileUploadBtn from "./buttons/FileUploadBtn";

const ChatInputToolsBtn = ({
  setPrompt,
}: {
  setPrompt: React.Dispatch<React.SetStateAction<string>>;
}) => {
  return (
    <div className="flex items-center justify-center gap-1">
      <FileUploadBtn />
      {/* internet button */}
      <Button
        variant="outline"
        className="bg-white border rounded-full w-10 h-10 flex items-center justify-center mt-2 cursor-pointer"
      >
        <Globe />
      </Button>
      {/* image creation button */}
      <ImgCreationToogleBtn />
      {/* mice button */}
      <MicBtn setPrompt={setPrompt} />
    </div>
  );
};

export default ChatInputToolsBtn;
