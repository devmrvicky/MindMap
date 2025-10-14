import { useImageUploadStore } from "@/zustand/store";
import { useState } from "react";
import { Loader } from "lucide-react";
import LoginDialog from "../LoginDialog";
import { useParams } from "react-router";
import { useScrollDetection } from "@/hooks/useScrollDetection";
import { ChatInput } from "./ChatInput";

const ChatInputContainer = () => {
  // get all var to use mice button
  const [prompt, setPrompt] = useState<string>("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [wantToImgUpload, setWantToImgUpload] = useState(false);

  const uploadedImgs = useImageUploadStore((state) => state.uploadedImgs);

  const { chatRoomId } = useParams();

  const { isScrollUp } = useScrollDetection();

  return (
    <div
      className={`${
        wantToImgUpload || uploadedImgs.length > 0
          ? "bg-white/70 dark:bg-zinc-800/50 backdrop-blur-sm border p-2"
          : ""
      } max-w-[700px] w-full my-3 flex flex-col items-center justify-center rounded-2xl ${
        chatRoomId
          ? `transition-[bottom] duration-100 ease-in-out sticky ${
              isScrollUp ? "bottom-2" : "bottom-[-100%]"
            } max-w-[500px] bg-blend-hard-light z-50`
          : ""
      }  `}
    >
      {wantToImgUpload && uploadedImgs.length === 0 && (
        <div className="w-full flex items-center gap-2 mb-2 top-[0px]  overflow-x-auto relative z-0">
          <div className="w-[80px] h-[80px] rounded border flex items-center justify-center">
            <Loader className="spin " />
          </div>
        </div>
      )}

      {/* uploaded images */}
      {uploadedImgs.length > 0 && (
        <div className="w-full flex items-center gap-2 mb-2 top-[0px]  overflow-x-auto relative z-0">
          {/* {wantToImgUpload && (
            <div className="w-[80px] h-[80px] rounded border flex items-center justify-center">
              <Loader className="spin " />
            </div>
          )} */}
          {uploadedImgs.map((img) => (
            <div className="w-[80px] h-[80px] rounded border relative">
              <img src={img.src} alt={img.name} className="w-fll h-full" />
              <button
                className="absolute top-0 right-0 text-red-500"
                onClick={() =>
                  useImageUploadStore.getState().removeImg(img.name)
                }
              >
                &times;
              </button>
              {wantToImgUpload && (
                <div className="w-[80px] h-[80px] rounded border flex items-center justify-center absolute top-0 right-0">
                  <Loader className="spin " />
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <ChatInput
        setWantToImgUpload={setWantToImgUpload}
        prompt={prompt}
        setPrompt={setPrompt}
      />
      {/* login dialog component */}
      <LoginDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </div>
  );
};

export default ChatInputContainer;
// This component is responsible for rendering the chat input field where users can type their messages. It uses Zustand for state management and handles sending the chat request to the LLM API.
