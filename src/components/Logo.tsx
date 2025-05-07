import logoPng from "../assets/mind-map.png";
import logoGif from "../assets/mind-map.gif";
import { useState } from "react";
import { useNavigate } from "react-router";
import { useChatStore } from "@/zustand/store";

const Logo = () => {
  const [currentLogoIcon, setCurrentLogoIcon] = useState(logoPng);
  const navigate = useNavigate();
  const { setActiveChatRoom, setCurrentChatsHistory } = useChatStore(
    (store) => store
  );

  return (
    <div
      className="flex items-center gap-2 p-2 justify-center cursor-pointer"
      onMouseEnter={() => setCurrentLogoIcon(logoGif)}
      onMouseLeave={() => setCurrentLogoIcon(logoPng)}
      onClick={() => {
        navigate("/");
        setActiveChatRoom(null);
        setCurrentChatsHistory([]);
      }}
    >
      <img
        src={currentLogoIcon}
        alt="Logo"
        className="w-8 h-8 rounded-ful object-cover"
      />
      <h1 className="text-2xl p-1">
        <b>Mind</b>Map
      </h1>
    </div>
  );
};

export default Logo;
