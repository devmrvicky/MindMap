import { Paperclip } from "lucide-react";
import { Label } from "../ui/label";
import { useImageUploadStore } from "@/zustand/store";
import { useRef } from "react";
import { handleUpload } from "@/handlers/handleUpload";

const FileUploadBtn = ({setWantToImgUpload}: {setWantToImgUpload: React.Dispatch<React.SetStateAction<boolean>>}) => {
  const addImg =
    useImageUploadStore((store) => store.addImg);
  const updateImg =
    useImageUploadStore((store) => store.updateImg);
  const setProgress =
    useImageUploadStore((store) => store.setProgress);

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
