import { env } from "@/env/env";
import { useModelStore } from "@/zustand/store";
import { Dispatch, SetStateAction } from "react";

const useStreamResponse = () => {
  const currentLLMModel = useModelStore((state) => state.currentLLMModel);
  const setIsResponseLoading = useModelStore(
    (state) => state.setIsResponseLoading
  );

  const getStreamedResponse = async ({
    prompt,
    setStreamResponse,
  }: // fileUrls,
  {
    prompt: string;
    setStreamResponse: Dispatch<SetStateAction<string>>;
    fileUrls: string[];
  }) => {
    console.log("streaming response...");
    if (!prompt) return "PENDING";
    const eventSource = new EventSource(
      `${
        env.VITE_SERVER_ENDPOINT
      }/chat/stream-generate?message=${encodeURIComponent(
        prompt
      )}&model=${currentLLMModel}`
    );

    eventSource.onmessage = (e) => {
      setIsResponseLoading(false);
      if (e.data !== "[DONE]") {
        try {
          // console.log(e.data);
          const parsed = JSON.parse(e.data);
          const delta = parsed.choices[0]?.delta?.content;
          if (delta) setStreamResponse((prev: string) => prev + delta);
        } catch (err) {
          console.error("Chunk parse error:", err, e.data);
        }
      }
    };

    eventSource.addEventListener("done", () => {
      eventSource.close();
    });

    return "DONE";
  };
  return { getStreamedResponse };
};

export default useStreamResponse;
