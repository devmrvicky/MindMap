import { Check, Copy } from "lucide-react";
import { Button } from "../ui/button";
import { useState } from "react";

const CopyBtn = ({
  text,
  className = "",
}: {
  text: string;
  className?: string;
}) => {
  const [isCopied, setIsCopied] = useState(false);
  const [timeOutId, setTimeOutId] = useState<NodeJS.Timeout>();
  if (!text) {
    return null; // Return null if text is empty
  }

  const copyToClipboard = () => {
    setIsCopied(false);
    if (timeOutId) {
      clearTimeout(timeOutId);
    }
    navigator.clipboard
      .writeText(text)
      .then(() => {
        // alert("Copied to clipboard!");
        let id = setTimeout(() => {
          setIsCopied(true);
        }, 500);
        setTimeOutId(id);
      })
      .catch((err) => {
        console.error("Failed to copy text: ", err);
        setIsCopied(false);
      });
  };

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => copyToClipboard()}
      title={isCopied ? "Copied!" : "Copy to clipboard"}
      className={`cursor-pointer ${className}`}
    >
      {isCopied ? <Check size={20} /> : <Copy size={20} />}
    </Button>
  );
};

export default CopyBtn;
