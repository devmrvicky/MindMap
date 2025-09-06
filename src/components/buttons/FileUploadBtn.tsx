import { Paperclip } from "lucide-react";
import { Label } from "../ui/label";
import { useImageUploadStore } from "@/zustand/store";
import { useRef } from "react";
import { handleUpload } from "@/handlers/handleUpload";

const FileUploadBtn = () => {
  const { addImg, setWantToImgUpload, updateImg, setProgress } =
    useImageUploadStore((store) => store);
  // Create a ref for the file input element to access its files easily
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div>
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
