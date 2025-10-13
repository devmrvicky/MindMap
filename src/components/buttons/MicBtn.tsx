import { Mic } from "lucide-react";
import { Button } from "../ui/button";
import useWebSpeech from "@/hooks/useWebSpeech";

const MicBtn = ({
  setPrompt,
}: {
  setPrompt: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const { handleStartListening, isListening, handleStopListening } =
    useWebSpeech();

  return (
    <Button
      variant="outline"
      className={`${
        isListening ? "bg-zinc-300" : "bg-white"
      } border rounded-full w-10 h-10 flex items-center justify-center cursor-pointer"`}
      onClick={() =>
        isListening
          ? handleStopListening()
          : handleStartListening({ setPrompt })
      }
      title={isListening ? "Stop Listening" : "Start Listening"}
      // setPrompt={setPrompt}
    >
      {isListening ? (
        // Music wave icon (SVG)
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <rect x="3" y="10" width="2" height="4" rx="1" fill="currentColor" />
          <rect x="7" y="7" width="2" height="10" rx="1" fill="currentColor" />
          <rect x="11" y="4" width="2" height="16" rx="1" fill="currentColor" />
          <rect x="15" y="7" width="2" height="10" rx="1" fill="currentColor" />
          <rect x="19" y="10" width="2" height="4" rx="1" fill="currentColor" />
        </svg>
      ) : (
        <Mic />
      )}
    </Button>
  );
};

export default MicBtn;
