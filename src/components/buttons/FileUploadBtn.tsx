import { Paperclip } from "lucide-react";
import { Label } from "../ui/label";
import { useImageUploadStore } from "@/zustand/store";
import { useRef } from "react";
import { handleUpload } from "@/handlers/handleUpload";

const FileUploadBtn = ({
  setWantToImgUpload,
}: {
  setWantToImgUpload: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const addImg = useImageUploadStore((store) => store.addImg);
  const updateImg = useImageUploadStore((store) => store.updateImg);
  const setProgress = useImageUploadStore((store) => store.setProgress);

  // Create a ref for the file input element to access its files easily
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div>
      <Label
        htmlFor="file-upload"
        className=" rounded-full w-full h-10 flex items-center gap-3 cursor-pointer"
      >
        <Paperclip className="w-4" />
        <span>File upload</span>
      </Label>
      <input
        type="file"
        id="file-upload"
        className="hidden"
        ref={fileInputRef}
        // disabled={true}
        onChange={() =>
          handleUpload({
            fileInputRef,
            addImg,
            setWantToImgUpload,
            setProgress,
            updateImg,
          })
        }
      />
    </div>
  );
};

export default FileUploadBtn;
