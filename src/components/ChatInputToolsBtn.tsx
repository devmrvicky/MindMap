import { Label } from "@radix-ui/react-label";
import { Globe, Paperclip } from "lucide-react";
import { Button } from "./ui/button";
import MicBtn from "./buttons/MicBtn";
import ImgCreationToogleBtn from "./buttons/ImgCreationToggleBtn";

const ChatInputToolsBtn = ({
  setPrompt,
}: {
  setPrompt: React.Dispatch<React.SetStateAction<string>>;
}) => {
  return (
    <div className="flex items-center justify-center gap-1">
      <Label
        htmlFor="file-upload"
        className=" border rounded-full w-10 h-10 flex items-center justify-center mt-2 cursor-pointer"
      >
        <Paperclip className="w-4" />
      </Label>
      <input
        type="file"
        id="file-upload"
        className="hidden"
        disabled={true}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            // Handle file upload here
            console.log("File selected:", file);
            // make blob url and display it in the chat
            const blobUrl = URL.createObjectURL(file);
            console.log(`Blob URL: ${blobUrl}`);
          }
        }}
      />
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
