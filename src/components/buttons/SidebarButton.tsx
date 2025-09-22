import useKeyboardShortcut from "@/hooks/useKeyboardShortcut";
import { SidebarTrigger } from "../ui/sidebar";
import { useRef } from "react";

const SidebarButton = () => {
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  useKeyboardShortcut(["ctrl", "ArrowRight"], () => {
    if (buttonRef.current) {
      buttonRef.current.click();
    } else {
      console.warn("Sidebar button ref is not assigned.");
    }
  });

  return <SidebarTrigger className="-ml-1" ref={buttonRef} />;
};

export default SidebarButton;
