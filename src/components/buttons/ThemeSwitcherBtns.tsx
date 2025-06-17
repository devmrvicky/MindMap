import useTheme from "@/hooks/useTheme";
import { Monitor, MoonIcon, SunIcon } from "lucide-react";

const ThemeSwitcherBtns = () => {
  const { switchTheme, currentTheme } = useTheme();
  return (
    <div className="flex flex-col w-full">
      <span className="mb-1 text-xs font-medium text-muted-foreground">
        Theme
      </span>
      <div className="flex gap-2">
        <button
          className="py-1 text-sm hover:bg-accent cursor-pointer border rounded-full px-3 flex items-center gap-1"
          onClick={() => switchTheme("light")}
        >
          {currentTheme === "light" && <SunIcon />} <span>Light</span>
        </button>
        <button
          className="py-1 text-sm hover:bg-accent cursor-pointer border rounded-full px-3 flex items-center gap-1"
          onClick={() => switchTheme("dark")}
        >
          {currentTheme === "dark" && <MoonIcon />} <span>Dark</span>
        </button>
        <button
          className="py-1 text-sm hover:bg-accent cursor-pointer border rounded-full px-3 flex items-center gap-2"
          onClick={() => switchTheme("system")}
        >
          {currentTheme === "system" && <Monitor />} <span>System</span>
        </button>
      </div>
    </div>
  );
};

export default ThemeSwitcherBtns;
