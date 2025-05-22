import axiosConfig from "@/axios/axiosConfig";
import { useChatStore } from "@/zustand/store";
import { useEffect } from "react";
import { v1 as uuidv1 } from "uuid";
import { useParams, useNavigate } from "react-router";
import useCreateData from "./useCreateData";
import { AxiosError } from "axios";
import { toast } from "react-toastify";

const useLLMRequest = () => {
  const {
    chatsHistory,
    currentChatsHistory,
    setCurrentChatsHistory,
    setIsResponseLoading,
    setLLMResponsedError,
    currentLLMModel,
    activeChatRoom,
    setActiveChatRoom,
    chatRooms,
  } = useChatStore((state) => state);

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
    onLimitReached?: () => void
  ): Promise<string | undefined> {
    try {
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
        if (res === "LIMIT_RICHED") return;
        navigate(`/c/${activeChatRoomId}`); // navigate to the new chat room
      }

      // * this function will be responsible for creating chat in indexDB and in mongoDB and also update zustand local store
      await createChat({ activeChatRoomId, prompt, role: "user" });
      // set the response loading state to true
      setIsResponseLoading(true);
      // make the post request to the server to get the response from the LLM
      const response = await axiosConfig.post("/chat/generate", {
        query: prompt,
        model: currentLLMModel,
        prevResponse: JSON.stringify(
          currentChatsHistory
            .map((chat) => ({
              role: chat.role,
              content: chat.content,
            }))
            .slice(-5) // send the last 5 messages to the server
        ), // send the previous response to the server
      });
      // handle axios error
      if (response.status !== 200) {
        console.error("Error in response from server");
        setIsResponseLoading(false);
        setLLMResponsedError("Error in response from server"); // here will actually be the error message from the llm
        return response.data;
      }
      const content = response.data.response.choices[0].message.content;

      // * this function will be responsible for creating chat in indexDB and in mongoDB and also update zustand local store
      await createChat({
        activeChatRoomId,
        prompt: content,
        role: "assistant",
      });
      // set the response loading state to false
      setIsResponseLoading(false);
      return content;
    } catch (error) {
      if(error instanceof AxiosError){
        toast.error(error.response?.data.message, {
          toastId: "chat request error"
        })
      }
      console.error("Error sending chat request:", error);
      setIsResponseLoading(false);
      return undefined;
    }
  }

  useEffect(() => {
    if (param.chatRoomId) {
      const chatRoom = chatRooms.find(
        (chatRoom) => chatRoom.chatRoomId === param.chatRoomId
      );
      if (chatRoom) {
        setActiveChatRoom(chatRoom);
        setCurrentChatsHistory(
          chatsHistory.filter((chat) => chat.chatRoomId === chatRoom.chatRoomId)
          // .reverse()
        );
        // when any chatroom will be active then in background this code will get all chats from mongoDB and update current chat history
        // axiosConfig
        //   .get(`/chat/${chatRoom.chatRoomId}`)
        //   .then((res) => {
        //     const chats = res.data.chats;
        //     setCurrentChatsHistory(chats);
        //   })
        //   .catch((error) => {
        //     if (error instanceof AxiosError) {
        //       toast.error(error.response?.data.message);
        //     }
        //     console.error(error);
        //   });
        // updateActiveChatRoom(chatRoom.id, currentChatsHistory);
        // setIsChatRoomActive(true);
      } else {
        // setCurrentChatsHistory([]);
        // If the chat room is not found, you can handle it accordingly (e.g., show an error message or redirect)
        console.error("Chat room not found");
        navigate("/"); // Redirect to home or another page
      }
    }
  }, [
    param.chatRoomId,
    chatRooms,
    setActiveChatRoom,
    setCurrentChatsHistory,
    navigate,
    chatsHistory,
  ]);

  return { getLLMResponse };
};

export default useLLMRequest;
