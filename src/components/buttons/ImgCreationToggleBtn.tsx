import { ImagePlus } from "lucide-react";
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
          ? "dark:bg-zinc-400 bg-balck dark:text-zinc-900 text-white"
          : "bg-transparent dark:text-white text-zinc-900"
      } w-full h-10 flex items-center gap-3 cursor-pointer px-2"`}
      onClick={() => {
        console.log("image generation on");
        setImageGenerationOn(!imageGenerationOn);
      }}
    >
      <ImagePlus />
      <span>Create image</span>
    </Toggle>
  );
};

export default ImgCreationToogleBtn;
