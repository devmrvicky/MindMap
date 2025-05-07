import axiosConfig from "@/axios/axiosConfig";
import { useChatStore } from "@/zustand/store";
import { useEffect } from "react";
import { v1 as uuidv1 } from "uuid";
import { useParams, useNavigate } from "react-router";

const useLLMRequest = () => {
  const {
    chatsHistory,
    currentChatsHistory,
    addNewChat,
    setCurrentChatsHistory,
    setIsResponseLoading,
    setLLMResponsedError,
    currentLLMModel,
    activeChatRoom,
    setActiveChatRoom,
    createNewChatRoom,
    chatRooms,
  } = useChatStore((state) => state);

  const navigate = useNavigate();
  const param = useParams();
  // const chatRoom = chatRooms.find(
  //   (chatRoom) => chatRoom.id === param.chatRoomId
  // );

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

  async function getLLMResponse(prompt: string): Promise<string | undefined> {
    try {
      let activeChatRoomId = param.chatRoomId || activeChatRoom?.id;
      let userChat: Chat;
      if (!activeChatRoomId) {
        // create a new chat room if there is no active chat room
        activeChatRoomId = uuidv1();
        const newChatRoom: ChatRoom = {
          id: activeChatRoomId,
          chatRoomName: prompt,
        };
        createNewChatRoom(newChatRoom);
        userChat = {
          id: uuidv1(),
          role: "user",
          content: prompt,
          chatRoomId: activeChatRoomId,
        };
        navigate(`/c/${activeChatRoomId}`); // navigate to the new chat room
      } else {
        // if there is an active chat room, create a new user chat and add the chat room id to the chat
        userChat = {
          id: uuidv1(),
          role: "user",
          content: prompt,
          chatRoomId: activeChatRoomId,
        };
      }

      addNewChat(userChat);

      // set the response loading state to true
      setIsResponseLoading(true);
      // make the post request to the server to get the response from the LLM
      const response = await axiosConfig.post("/generate-response", {
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
      // const content = response.data.message;

      const assistantChat: Chat = {
        id: uuidv1(),
        role: "assistant",
        content: content,
        chatRoomId: activeChatRoomId,
      };

      addNewChat(assistantChat);
      // set the response loading state to false
      setIsResponseLoading(false);
      return content;
    } catch (error) {
      console.error("Error sending chat request:", error);
      setIsResponseLoading(false);
      return undefined;
    }
  }

  useEffect(() => {
    if (param.chatRoomId) {
      const chatRoom = chatRooms.find(
        (chatRoom) => chatRoom.id === param.chatRoomId
      );
      console.log("chat room from useEffect", chatRoom);
      if (chatRoom) {
        setActiveChatRoom(chatRoom);
        setCurrentChatsHistory(
          chatsHistory.filter((chat) => chat.chatRoomId === chatRoom.id)
        );
        // updateActiveChatRoom(chatRoom.id, currentChatsHistory);
        // setIsChatRoomActive(true);
      } else {
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
