import * as React from "react";
import { Button } from "@/components/ui/button";
import { Copy, Download, Share2 } from "lucide-react";
import ImgWithSkeleton from "./ImgWithSketeton";
import DialogUtil from "./dialogs/Dialog-util";

interface ImgPopupProps {
  src: string;
  alt?: string;
  className?: string;
  prompt: string;
}

const downloadImage = (src: string) => {
  const link = document.createElement("a");
  link.href = src;
  link.download = "image";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const copyToClipboard = (prompt: string) => {
  navigator.clipboard.writeText(prompt);
};

const shareImage = async (src: string) => {
  if (navigator.canShare && navigator.canShare({ files: [] })) {
    try {
      const response = await fetch(src);
      console.log(response);
      // return;
      const blob = await response.blob();
      const file = new File([blob], "image.png", { type: blob.type });
      await navigator.share({
        title: "Check out this image",
        files: [file],
      });
    } catch (error) {
      alert("Failed to share image.");
    }
  } else if (navigator.share) {
    await navigator.share({
      title: "Check out this image",
      url: src,
    });
  } else {
    alert("Share not supported on this browser.");
  }
};

export const ImgPopup: React.FC<ImgPopupProps> = ({ src, alt, className }) => {
  const [open, setOpen] = React.useState<boolean>(false);
  return (
    <DialogUtil open={open} setOpen={setOpen}>
      <Button
        variant={"ghost"}
        onClick={(e) => {
          e.stopPropagation();
          // DialogTrigger will handle opening the dialog
          setOpen(true);
        }}
        // style={{ display: "inline-block" }}
        className="w-full h-full p-0"
      >
        <ImgWithSkeleton src={src} className={className} alt={alt} />
      </Button>
      <div className="flex flex-col items-center justify-center bg-black/90 p-0 max-w-full max-h-screen">
        <ImgWithSkeleton
          src={src}
          alt={alt}
          className="h-full w-full rounded-lg object-contain"
        />
        <div className="flex gap-2 mt-4 absolute bottom-4 right-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => shareImage(src)}
            title="Share"
          >
            <Share2 size={20} />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => downloadImage(src)}
            title="Download"
          >
            <Download size={20} />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => copyToClipboard(src)}
            title="Copy Image URL"
          >
            <Copy size={20} />
          </Button>
        </div>
      </div>
    </DialogUtil>
  );
};

export default ImgPopup;
