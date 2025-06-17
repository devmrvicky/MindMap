import { ImagePlus } from "lucide-react";
import { Button } from "../ui/button";
import { useImageStore } from "@/zustand/store";
import { Toggle } from "@/components/ui/toggle";

const ImgCreationToogleBtn = () => {
  const { imageGenerationOn, setImageGenerationOn } = useImageStore(
    (store) => store
  );
  return (
    <Toggle
      className={`${
        imageGenerationOn
          ? "dark:bg-zinc-400 bg-balck"
          : "bg-transparent dark:bg-zinc-800"
      } border rounded-full w-10 h-10 flex items-center justify-center mt-2 cursor-pointer"`}
      onClick={() => {
        console.log("image generation on");
        setImageGenerationOn(!imageGenerationOn);
      }}
    >
      {/* <Button
        variant="outline"
        
      > */}
      <ImagePlus
        className={`${
          imageGenerationOn
            ? "dark:text-zinc-900 text-white"
            : "dark:text-white text-zinc-900"
        } `}
      />
      {/* </Button> */}
    </Toggle>
  );
};

export default ImgCreationToogleBtn;
