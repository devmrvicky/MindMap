import { ImagePlus } from "lucide-react";
import { Button } from "../ui/button";
import { useImageStore } from "@/zustand/store";

const ImgCreationToogleBtn = () => {
  const { imageGenerationOn, setImageGenerationOn } = useImageStore(
    (store) => store
  );
  return (
    <Button
      variant="outline"
      className={`${
        imageGenerationOn ? "bg-zinc-400" : "bg-white"
      } border rounded-full w-10 h-10 flex items-center justify-center mt-2 cursor-pointer"`}
      onClick={() => {
        console.log("image generation on");
        setImageGenerationOn(!imageGenerationOn);
      }}
    >
      <ImagePlus />
    </Button>
  );
};

export default ImgCreationToogleBtn;
