import {
  useChatRoomStore,
  useChatStore,
  useImageStore,
  useImageUploadStore,
  useModelStore,
} from "@/zustand/store";
import { v1 as uuidv1 } from "uuid";
import { useParams, useNavigate } from "react-router";
import useCreateData from "./useCreateData";
import { AxiosError } from "axios";
import { toast } from "react-toastify";
import { llmService } from "../services/llmService";

const useLLMRequest = () => {
  const activeChatRoom = useChatRoomStore((state) => state.activeChatRoom);
  const currentChatsHistory = useChatStore(
    (state) => state.currentChatsHistory
  );
  // const { setIsResponseLoading, setLLMResponsedError, currentLLMModel } =
  //   useModelStore((state) => state);
  // const { uploadedImgs, setUploadedImgs } = useImageUploadStore(
  //   (store) => store
  // );
  // get rest of the props one by one
  const setIsResponseLoading = useModelStore(
    (state) => state.setIsResponseLoading
  );
  const setLLMResponsedError = useModelStore(
    (state) => state.setLLMResponsedError
  );
  const currentLLMModel = useModelStore((state) => state.currentLLMModel);
  const setChatRequestAbortController = useModelStore(
    (state) => state.setChatRequestAbortController
  );
  const uploadedImgs = useImageUploadStore((store) => store.uploadedImgs);
  const setUploadedImgs = useImageUploadStore((store) => store.setUploadedImgs);

  const imageGenerationOn = useImageStore((state) => state.imageGenerationOn);

  const { createChatRoom, createChat } = useCreateData();

  const navigate = useNavigate();
  const { chatRoomId } = useParams();

  const controller = llmService.createAbortController();

  /*
Logic:
  - before sending the request, check if you are in a chat room or not
  first condition: (if you are in a chat room)
  - if you are in a chat room then get chat room id and id to every new chat etheir that is from user or assistant
  - after add chat room id to the chat, add the chat to current chats history
  - after add chat to current chats history, send the request to the server
  - after getting the response from the server, add the response to the current chats history with current chat room id

  second condition: (if you are not in a chat room)
  - if you are not in a active chat room then create a new chat room first before creating a new user chat
  - after creating a new chat room, create a new user chat and add the chat room id to the chat
  - after add chat room id to the chat, add the chat to current chats history
  - after add chat to current chats history, send the request to the server
  - after getting the response from the server, add the response to the current chats history with current chat room id

*/

  async function getLLMResponse(
    prompt: string,
    // setStreamResponse: Dispatch<SetStateAction<string>>,
    // streamResponse: string,
    onLimitReached?: () => void
  ): Promise<string | undefined> {
    try {
      setLLMResponsedError(""); // reset the error state
      setChatRequestAbortController(controller);

      let activeChatRoomId = chatRoomId || activeChatRoom?.chatRoomId;

      // let userChat: Chat;
      if (!activeChatRoomId) {
        // create a new chat room if there is no active chat room
        activeChatRoomId = uuidv1();
        // * this function is responsible for creating chat room in indexDB mongoDB and also update local zustand store
        const res = await createChatRoom({
          activeChatRoomId,
          prompt,
          onLimitReached,
        });
        // console.log(res);
        if (res === "LIMIT_RICHED" || res === "ERROR_OCCUR") return;
        navigate(`/c/${activeChatRoomId}`); // navigate to the new chat room
      }

      // * this function will be responsible for creating chat in indexDB and in mongoDB and also update zustand local store (but only for role: user)
      const err = await createChat({
        activeChatRoomId,
        fileUrls:
          uploadedImgs.length > 0 ? uploadedImgs.map((img) => img.src) : [],
        content: prompt,
        role: "user",
      });
      if (err === "ERROR_OCCUR") return;
      // set the response loading state to true
      // setIsResponseLoading(true);
      // make the post request to the server to get the response from the LLM
      let aiResponse;
      if (imageGenerationOn) {
        // if image generation is on then send the request to the image generation endpoint
        aiResponse = await llmService.getImageResponse({
          prompt,
          model: currentLLMModel.id!,
        });
      } else {
        //? this code is responsible for genereate ai response at once
        aiResponse = await llmService.getChatLlmResponse({
          prompt,
          model: currentLLMModel.id!,
          fileUrls: uploadedImgs.map((img) => img.src),
          prevResponses: JSON.stringify(
            currentChatsHistory
              .slice(currentChatsHistory.length - 5, currentChatsHistory.length)
              .map((chat: Chat) => ({
                role: chat.role,
                content: chat.content[0].content,
              }))
          ),
          signal: controller.signal,
        });
      }

      // set the response loading state to false
      setIsResponseLoading(false);

      // reset the uploaded images state
      setUploadedImgs([]);

      // console.log("AI response: ", aiResponse.data);
      let content: string;
      if (imageGenerationOn) {
        // if image generation is on then get the image url from the response
        content = aiResponse.data[0].url;
      } else {
        content = aiResponse.choices[0].message.content;
        console.log({ aiResponse });
      }

      // * this function will be responsible for creating chat in indexDB and in mongoDB and also update zustand local store (for role: assistant)
      const error = await createChat({
        activeChatRoomId,
        content,
        role: "assistant",
        model: aiResponse.model,
      });
      if (error === "ERROR_OCCUR") {
        setIsResponseLoading(false);
        setLLMResponsedError("Error in response from server");
        return;
      }
      return content;
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message, {
          toastId: "chat request error",
        });
        setLLMResponsedError(
          error.response?.data.message || "An error occurred"
        );
      } else {
        setLLMResponsedError(
          "An error occurred while sending the chat request"
        );
        toast.error("An error occurred while sending the chat request");
        console.error("Error sending chat request:", error);
      }
      setIsResponseLoading(false);
      return undefined;
    } finally {
      setIsResponseLoading(false);
    }
  }

  return { getLLMResponse };
};

export default useLLMRequest;
