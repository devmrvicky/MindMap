import { useState } from "react";

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

  return { handleStartSpeak, handleStopSpeak, isSpeaking };
};

export default useWebSpeech;
