// useBackButtonClose.ts
import { useEffect } from "react";

const useBackButtonClose = (
  isOpen: boolean,
  onClose: () => void,
  { willCloseOnBackButton = true }: { willCloseOnBackButton?: boolean }
) => {
  useEffect(() => {
    if (!willCloseOnBackButton) return;
    if (isOpen) {
      // Add a dummy history entry so the back button triggers popstate
      window.history.pushState({ modalOpen: true }, "");
    }

    const handlePopState = () => {
      if (isOpen) {
        onClose();
        // Re-add the state to prevent double-back issues
        window.history.pushState({ modalOpen: false }, "");
      }
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
      // When modal closes manually, remove that extra history entry
      if (isOpen) {
        window.history.back();
      }
    };
  }, [isOpen, onClose]);
};

export default useBackButtonClose;
