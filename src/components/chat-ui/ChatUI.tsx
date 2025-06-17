import { useIsMobile } from "@/hooks/use-mobile";
import GreetingMessageComp from "../GreetingMessage";
import ChatContainer from "./ChatContainer";
import ChatInput from "./ChatInput";
import { useAuthStore, useChatStore } from "@/zustand/store";
import { useEffect } from "react";
import { useParams } from "react-router";
import { getChatsByChatRoomId } from "@/indexDB/indexDB";
import axiosConfig from "@/axios/axiosConfig";

const ChatUI = () => {
  const { currentChatsHistory, setCurrentChatsHistory } = useChatStore(
    (state) => state
  );

  const isMobile = useIsMobile();
  const { user } = useAuthStore((store) => store);

  const params = useParams();

  useEffect(() => {
    (async () => {
      try {
        console.log("from chat ui: ", params);
        const { chatRoomId } = params;
        if (!user) {
          // fetch user data from indexDB
          // const chats = await getAllData({storeName: "chat"})
          console.log(params);
          if (!chatRoomId) return;
          const chats = await getChatsByChatRoomId(chatRoomId);
          console.log(chats);
          setCurrentChatsHistory(chats);
        } else {
          // fetch user data from mongoDB
          const res = await axiosConfig.get(`/chat/${chatRoomId}`);
          const chatsFromMongoDB = res.data.chats;
          console.log("chatsFromMongoDB ", chatsFromMongoDB);
          setCurrentChatsHistory(chatsFromMongoDB);
          // set chats to index databasep
        }
      } catch (error) {
        console.error(error);
      }
    })();
  }, [params, user, setCurrentChatsHistory]);

  return (
    <div
      className="bg-white dark:bg-black w-full h-full chat-container"
      // ref={chatContainerRef}
    >
      <div
        className={`max-w-[900px] mx-auto p-4 h-full flex items-center  flex-col ${
          isMobile ? "pb-0 justify-end" : "justify-center"
        } ${currentChatsHistory.length > 0 ? "justify-end items-center" : ""}`}
      >
        {!currentChatsHistory.length && <GreetingMessageComp />}

        {!currentChatsHistory.length || <ChatContainer />}

        {/* chat input */}
        <ChatInput />
      </div>
    </div>
  );
};

export default ChatUI;
