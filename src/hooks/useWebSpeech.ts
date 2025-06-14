import { useRef, useState } from "react";
import { toast } from "react-toastify";

// Extend the Window interface to include SpeechRecognition types
declare global {
  interface Window {
    SpeechRecognition: typeof window.webkitSpeechRecognition | undefined;
    webkitSpeechRecognition: any;
  }
}

const useWebSpeech = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [utterance, setUtterance] = useState<SpeechSynthesisUtterance | null>(
    null
  );

  const handleStartSpeak = ({
    text,
    selectedVoice,
  }: {
    text: string;
    selectedVoice?: SpeechSynthesisVoice | null;
  }) => {
    if (isSpeaking) return;
    const u = new window.SpeechSynthesisUtterance(text);
    u.lang = selectedVoice ? selectedVoice.lang : "en-IN";
    u.voice = selectedVoice
      ? selectedVoice
      : window.speechSynthesis
          .getVoices()
          .find((v) => v.name === "Microsoft Heera - English (India)") || null;
    u.onend = () => setIsSpeaking(false);
    u.onerror = () => setIsSpeaking(false);
    setUtterance(u);
    setIsSpeaking(true);
    window.speechSynthesis.speak(u);
  };

  const handleStopSpeak = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    setUtterance(null);
  };

  // speech recognition
  const [isListening, setIsListening] = useState(false);
  const [speech, setSpeech] = useState("");
  // Add type declaration for SpeechRecognition if not present
  type SpeechRecognitionType = typeof window.SpeechRecognition extends undefined
    ? typeof window.webkitSpeechRecognition
    : typeof window.SpeechRecognition;

  const recognitionRef = useRef<InstanceType<SpeechRecognitionType> | null>(
    null
  );

  const handleStartListening = ({
    setPrompt,
  }: {
    setPrompt: React.Dispatch<React.SetStateAction<string>>;
  }) => {
    if (
      !("webkitSpeechRecognition" in window || "SpeechRecognition" in window)
    ) {
      toast.error("Speech recognition is not supported in this browser.");
      return;
    }
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    // recognition.lang = "hi-IN"; // or "" for Hindi, etc.
    recognition.lang = "en-US"; // or "hi-IN" for Hindi, etc.
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event: any) => {
      console.log(event);
      const transcript = event.results[0][0].transcript;
      setPrompt((prev) => (prev ? prev + " " + transcript : transcript));
    };
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);

    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
  };

  const handleStopListening = () => {
    recognitionRef.current?.stop();
    setIsListening(false);
  };

  // console.log(speech);

  return {
    handleStartSpeak,
    handleStopSpeak,
    isSpeaking,
    handleStartListening,
    handleStopListening,
    isListening,
    speech,
    recognitionRef,
  };
};

export default useWebSpeech;
