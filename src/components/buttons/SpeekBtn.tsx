import { Square, ChevronDown, Volume2 } from "lucide-react";
import { Button } from "../ui/button";
import useWebSpeech from "@/hooks/useWebSpeech";
import { Dialog, DialogContent, DialogTitle } from "../ui/dialog";
import { useEffect, useState } from "react";

const SpeekBtn = ({ text }: { text: string }) => {
  const { handleStartSpeak, handleStopSpeak, isSpeaking } = useWebSpeech();
  const [selectedVoice, setSelectedVoice] =
    useState<SpeechSynthesisVoice | null>(null);

  // useEffect(() => {
  //   handleStartSpeak({ text, selectedVoice: selectedVoice });
  // }, []);
  return (
    <div className="flex border rounded-2xl items-center  backdrop-blur-2xl bg-[#000000]/50">
      {!isSpeaking ? (
        <>
          <Button
            variant="outline"
            className="cursor-pointer border-none"
            onClick={() =>
              handleStartSpeak({ text, selectedVoice: selectedVoice })
            }
            disabled={isSpeaking}
            title="Speak"
          >
            <Volume2 />
          </Button>
          <SeleteVoices
            selectedVoice={selectedVoice}
            setSelectedVoice={setSelectedVoice}
          />
        </>
      ) : (
        <Button
          variant="outline"
          className="cursor-pointer border-none"
          onClick={handleStopSpeak}
          disabled={!isSpeaking}
          title="Stop"
        >
          <Square />
        </Button>
      )}
    </div>
  );
};

type SeleteVoicesProps = {
  selectedVoice: SpeechSynthesisVoice | null;
  setSelectedVoice: React.Dispatch<
    React.SetStateAction<SpeechSynthesisVoice | null>
  >;
};

const SeleteVoices = ({
  selectedVoice,
  setSelectedVoice,
}: SeleteVoicesProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  // Load voices
  useEffect(() => {
    const loadVoices = () => {
      const allVoices = window.speechSynthesis.getVoices();
      setVoices(allVoices);
      // Set default voice if not set
      if (!selectedVoice && allVoices.length > 0) {
        setSelectedVoice(allVoices[0]);
      }
    };
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
    // eslint-disable-next-line
  }, []);

  return (
    <>
      <Button
        variant="outline"
        className="cursor-pointer border-none"
        onClick={() => setDialogOpen(true)}
        title="Choose Voice"
      >
        <ChevronDown />
      </Button>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogTitle>Select Voice</DialogTitle>
          <div className="max-h-80 overflow-y-auto space-y-2">
            {voices.map((voice) => (
              <div
                key={voice.voiceURI}
                className={`flex items-center justify-between p-2 rounded cursor-pointer ${
                  selectedVoice?.voiceURI === voice.voiceURI
                    ? "bg-green-100 text-white dark:text-black font-bold"
                    : "hover:bg-gray-500  hover:text-white hover:dark:text-black"
                }`}
                onClick={() => {
                  setSelectedVoice(voice);
                  setDialogOpen(false);
                }}
              >
                <span>
                  <img
                    src={`https://flagcdn.com/24x18/${voice.lang
                      .split("-")[1]
                      ?.toLowerCase()}.png`}
                    alt=""
                    className="inline mr-2 rounded-sm"
                    width={24}
                    height={18}
                  />
                  {voice.name.replace(/Microsoft\s*/gi, "")}{" "}
                  <span className="text-xs text-gray-500">({voice.lang})</span>
                </span>
                {voice.localService && (
                  <span className="text-xs text-blue-500">Local</span>
                )}
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SpeekBtn;
