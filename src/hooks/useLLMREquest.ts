import {
  useChatRoomStore,
  useImageStore,
  useImageUploadStore,
  useModelStore,
} from "@/zustand/store";
import { v1 as uuidv1 } from "uuid";
import { useParams, useNavigate } from "react-router";
import useCreateData from "./useCreateData";
import { AxiosError } from "axios";
import { toast } from "react-toastify";
import LlmService from "../services/llmService";

const llmService = new LlmService();

const useLLMRequest = () => {
  const { activeChatRoom } = useChatRoomStore((state) => state);

  const { setIsResponseLoading, setLLMResponsedError, currentLLMModel } =
    useModelStore((state) => state);
  const { uploadedImgs, setUploadedImgs } = useImageUploadStore(
    (store) => store
  );

  const { imageGenerationOn } = useImageStore((state) => state);

  const { createChatRoom, createChat } = useCreateData();

  const navigate = useNavigate();
  const param = useParams();

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

      let activeChatRoomId = param.chatRoomId || activeChatRoom?.chatRoomId;

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
      setIsResponseLoading(true);
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
        });
      }

      // reset the uploaded images state
      setUploadedImgs([]);

      // console.log("AI response: ", aiResponse.data);
      let content: string;
      if (imageGenerationOn) {
        // if image generation is on then get the image url from the response
        content = aiResponse.data.data[0].url;
      } else {
        content = aiResponse.choices[0].message.content;
      }

      // * this function will be responsible for creating chat in indexDB and in mongoDB and also update zustand local store (for role: assistant)
      const error = await createChat({
        activeChatRoomId,
        content,
        role: "assistant",
      });
      if (error === "ERROR_OCCUR") {
        setIsResponseLoading(false);
        setLLMResponsedError("Error in response from server");
        return;
      }
      // set the response loading state to false
      setIsResponseLoading(false);
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
    }
  }

  // async function getLLMRegeneratedResponse({
  //   chatId,
  //   query,
  //   model,
  //   prevResponse,
  // }: {
  //   chatId: string;
  //   query: string;
  //   model: string;
  //   prevResponse: Chat[];
  // }) {
  //   try {
  //     setIsResponseLoading(true);
  //     const aiResponse = await axiosConfig.post("chat/regenerate", {
  //       chatId,
  //       query,
  //       model,
  //       prevResponse: JSON.stringify(
  //         prevResponse.map((chat) => ({
  //           role: chat.role,
  //           content: chat.content[0].content,
  //         }))
  //       ),
  //     });
  //     // handle axios error
  //     if (aiResponse?.status !== 200) {
  //       console.error("Error in response from server");
  //       setIsResponseLoading(false);
  //       setLLMResponsedError("Error in response from server"); // here will actually be the error message from the llm
  //       return;
  //     }
  //     // update zustand local store
  //     updateChat({
  //       chatId,
  //       content: aiResponse.data.response.choices[0].message.content,
  //       model: aiResponse.data.response.choices[0].message.model,
  //     });
  //     // update indexDB store
  //     const targetChat = currentChatsHistory.find(
  //       (chat) => chat.chatId === chatId
  //     );
  //     if (!targetChat) {
  //       console.error("Chat not found in current chats history");
  //       return;
  //     }
  //     targetChat?.content.push({
  //       content: aiResponse.data.response.choices[0].message.content,
  //       type: "text",
  //       model: aiResponse.data.response.choices[0].message.model,
  //     });
  //     console.log(targetChat);
  //     updateData({
  //       storeName: "chat",
  //       data: targetChat,
  //     });
  //   } catch (error) {
  //     if (error instanceof AxiosError) {
  //       toast.error(error.response?.data.message, {
  //         toastId: "chat request error",
  //       });
  //       setLLMResponsedError(
  //         error.response?.data.message || "An error occurred"
  //       );
  //     } else {
  //       setLLMResponsedError(
  //         "An error occurred while sending the chat request"
  //       );
  //       toast.error("An error occurred while sending the chat request");
  //       console.error("Error sending chat request:", error);
  //     }
  //     setIsResponseLoading(false);
  //   }
  // }

  return { getLLMResponse };
};

export default useLLMRequest;
