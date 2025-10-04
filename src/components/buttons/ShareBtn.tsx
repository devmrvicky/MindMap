import { shareText } from "@/handlers/handleShares";
import { Button } from "../ui/button";
import { Share2 } from "lucide-react";

const ShareBtn = ({
  url,
  text,
  className,
}: {
  url?: string;
  text?: string;
  className?: string;
}) => {
  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => shareText({ url, text })}
      className={`cursor-pointer ${className} backdrop-blur-2xl bg-[#000000]/50`}
    >
      <Share2 />
    </Button>
  );
};

export default ShareBtn;
