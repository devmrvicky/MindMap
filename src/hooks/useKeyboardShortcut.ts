// useKeyboardShortcut.js
import { useEffect } from "react";
interface KeyboardShortcutOptions {
  keys: string[];
  callback: () => void;
}

export default function useKeyboardShortcut(
  keys: KeyboardShortcutOptions["keys"],
  callback: KeyboardShortcutOptions["callback"]
): void {
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent): void => {
      const isMatch = keys.every((key: string) =>
        key === "ctrl" ? e.ctrlKey || e.metaKey : e.key === key
      );
      if (isMatch) {
        e.preventDefault();
        callback();
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [keys, callback]);
}
