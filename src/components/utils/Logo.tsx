import logoPng from "@/assets/mind-map.png";
import logoGif from "@/assets/mind-map.gif";
import { useState } from "react";
import { useNavigate } from "react-router";
import { useChatStore } from "@/zustand/store";

const Logo = ({ isIconSpin }: { isIconSpin?: boolean }) => {
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);
  const [currentLogoIcon, setCurrentLogoIcon] = useState(
    isIconSpin ? logoGif : logoPng
  );
  const navigate = useNavigate();
  const { setActiveChatRoom, setCurrentChatsHistory } = useChatStore(
    (store) => store
  );

  return (
    <button
      className="w-full flex items-center gap-2 p-2 justify-center cursor-pointer outline-none"
      onMouseEnter={() => {
        setTimeoutId(
          setTimeout(() => {
            setCurrentLogoIcon(isIconSpin ? logoPng : logoGif);
          }, 1000)
        );
      }}
      onMouseLeave={() => {
        setCurrentLogoIcon(isIconSpin ? logoGif : logoPng);
        if (timeoutId) clearTimeout(timeoutId);
      }}
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
    </button>
  );
};

export default Logo;
