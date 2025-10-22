import { createContext, useContext, useEffect, useRef } from "react";

type CloseHandler = () => void;

type BackButtonContextType = {
  register: (handler: CloseHandler) => void;
  unregister: (handler: CloseHandler) => void;
};

const BackButtonContext = createContext<BackButtonContextType | null>(null);

const BackButtonProvider = ({ children }: { children: React.ReactNode }) => {
  const stack = useRef<CloseHandler[]>([]);

  const register = (handler: CloseHandler) => {
    stack.current.push(handler);
    // Add a history entry so back button triggers popstate
    window.history.pushState({ overlay: true }, "");
  };

  const unregister = (handler: CloseHandler) => {
    stack.current = stack.current.filter((h) => h !== handler);
    // Clean up the history entry
    if (window.history.state?.overlay) {
      window.history.back();
    }
  };

  useEffect(() => {
    const handlePopState = () => {
      const last = stack.current.pop();
      if (last) {
        last();
        // Prevent navigation by pushing a dummy state again
        window.history.pushState({ overlay: false }, "");
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  return (
    <BackButtonContext.Provider value={{ register, unregister }}>
      {children}
    </BackButtonContext.Provider>
  );
};

export const useBackButtonContext = () => {
  const context = useContext(BackButtonContext);
  if (!context) {
    throw new Error(
      "useBackButtonContext must be used inside BackButtonProvider"
    );
  }
  return context;
};

export default BackButtonProvider;
