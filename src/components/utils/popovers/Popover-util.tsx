import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { DrawerUtilProps } from "../drawer/Drawer-util";
import useBackButtonClose from "@/hooks/useBackButtonClose";

const PopoverUtil = ({
  children,
  open,
  setOpen,
  willCloseOnBackButton = true,
}: DrawerUtilProps) => {
  useBackButtonClose(open, () => setOpen(false), { willCloseOnBackButton });

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>{children[0] as React.ReactNode}</PopoverTrigger>
      <PopoverContent className="w-full p-0">
        {children[1] as React.ReactNode}
      </PopoverContent>
    </Popover>
  );
};

export default PopoverUtil;
