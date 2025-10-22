import { MoreHorizontal } from "lucide-react";
import { Button } from "../../ui/button";
import PopoverUtil from "./Popover-util";
import { useState } from "react";

const MoreOptionPopover = ({
  children,
  willCloseOnBackButton,
}: {
  children: React.ReactNode;
  willCloseOnBackButton?: boolean;
}) => {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <PopoverUtil
      open={open}
      setOpen={setOpen}
      willCloseOnBackButton={willCloseOnBackButton}
    >
      <Button variant={"ghost"} onClick={() => setOpen(true)}>
        <MoreHorizontal className="min-w-5 min-h-5" />
      </Button>
      {children}
    </PopoverUtil>
  );
};

export default MoreOptionPopover;
