import { useEffect } from "react";
import { useIsMobile } from "./use-mobile";

type Options = {
  willCloseOnBackButton?: boolean;
};

const useBackButtonClose = (
  isOpen: boolean,
  onClose: () => void,
  { willCloseOnBackButton = true }: Options = {}
) => {
  const isMobile = useIsMobile();

  useEffect(() => {
    if (!isMobile || !willCloseOnBackButton) return;

    let addedHistoryState = false;

    const handlePopState = (event: PopStateEvent) => {
      if (isOpen && event.state?.modalOpen) {
        onClose();
        // Prevent double back issues
        window.history.pushState({ modalOpen: false }, "");
      }
    };

    if (isOpen) {
      // Add a dummy state to trigger popstate when back button is pressed
      window.history.pushState({ modalOpen: true }, "");
      addedHistoryState = true;
    }

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);

      // Only go back if we added a history state
      if (addedHistoryState) {
        // Prevent navigating away if the user already left modal context
        if (window.history.state?.modalOpen) {
          window.history.back();
        }
      }
    };
  }, [isOpen, onClose, isMobile, willCloseOnBackButton]);
};

export default useBackButtonClose;
