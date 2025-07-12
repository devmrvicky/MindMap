import axiosConfig from "@/axios/axiosConfig";
import { updateData } from "@/indexDB/indexDB";
import { useAuthStore, useChatStore } from "@/zustand/store";
import { AxiosError } from "axios";
import { toast } from "react-toastify";
import { v1 as uuidv1 } from "uuid";

interface createChatRoomProps {
  activeChatRoomId: ChatRoom["chatRoomId"];
  prompt: string;
  onLimitReached?: () => void;
}
interface createChatProps {
  activeChatRoomId: ChatRoom["chatRoomId"];
  content: string;
  role: "user" | "assistant";
}

// this hook will be responsible for creating all data withing my app. like "Chat rooms", "Chats". this hook will create data on local indexDB and on mongoDB and also responsible for update zustand store to see changes in chat ui
const useCreateData = () => {
  const { createNewChatRoomOnLocal, addNewChat, currentLLMModel, chatRooms } =
    useChatStore((store) => store);

  const { user } = useAuthStore((store) => store);

  // create chat rooms
  const createChatRoom = async ({
    activeChatRoomId,
    prompt,
    onLimitReached,
  }: createChatRoomProps) => {
    try {
      // prevent user to create another chat room if user have already reached limit
      if (!user) {
        if (chatRooms.length >= import.meta.env.VITE_FREE_CHAT_ROOMS) {
          // navigate("/auth/login");
          const id = toast.warn(
            "You need to log in to continue using MindMap app."
          );
          console.log(id);
          if (onLimitReached) onLimitReached();
          // throw new Error("LIMIT_RICHED");
          return "LIMIT_RICHED";
        }
      }
      const newChatRoom: ChatRoom = {
        chatRoomId: activeChatRoomId,
        chatRoomName: prompt,
        userId: user?._id || "",
      };
      // update zustand chat room store
      createNewChatRoomOnLocal(newChatRoom);
      // create new chat room in indexDB
      updateData({
        data: newChatRoom,
        storeName: "chatRoom",
      });
      // create chat room in mongoDB (condition: when user logged in means if user has value)
      if (user) {
        const chatRoom = await axiosConfig.post(
          "/chat/room/create",
          newChatRoom
        );
        console.log("create chat room successfully: ", chatRoom);
      }
    } catch (error) {
      toast.error(
        error instanceof AxiosError
          ? error.response?.data.message
          : "Unknown error occur"
      );
      console.error(error);
      return "ERROR_OCCUR";
    }
  };

  // create chats
  const createChat = async ({
    activeChatRoomId,
    content,
    role,
  }: createChatProps) => {
    const newChat: Chat = {
      chatId: uuidv1(),
      role,
      content: [
        {
          content,
          type: "text",
          model: currentLLMModel,
        },
      ],
      chatRoomId: activeChatRoomId,
    };

    // update zustand store to see ui effect (this function is responsible for updating all chat history and current chat history. this function will update chats history because we have to filtered chats for deleting and will update current chat history because updating chat ui)
    addNewChat(newChat);
    // create new chat in indexDB
    updateData({
      data: newChat,
      storeName: "chat",
    });
    try {
      // create chat in mongoDB(condition: when user logged in means if user has value)
      if (user) {
        const chatRes = await axiosConfig.post(
          `/chat/create/${activeChatRoomId}`,
          {
            content: content,
            usedModel: currentLLMModel,
            chatId: newChat.chatId,
            role: role,
          }
        );
        console.log("chat created : ", chatRes);
      }
    } catch (error) {
      toast.error(
        error instanceof AxiosError
          ? error.response?.data.message
          : "Unknown error occur"
      );
      console.error(error);
      return "ERROR_OCCUR";
    }
  };

  return { createChatRoom, createChat };
};

export default useCreateData;
