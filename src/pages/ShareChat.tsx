import { useParams } from "react-router";

const ShareChat = () => {
  const { chatRoomId } = useParams<{ chatRoomId: string }>();
  if (!chatRoomId) return <div>no chat room id</div>;
  return (
    <div>
      <h1>Share Chat</h1>
      <p>Chat Room ID: {chatRoomId}</p>
    </div>
  );
};

export default ShareChat;
