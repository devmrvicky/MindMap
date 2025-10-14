import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DrawerUtilProps } from "../drawer/Drawer-util";
import useBackButtonClose from "@/hooks/useBackButtonClose";

const DialogUtil = ({
  children,
  open,
  setOpen,
  title,
  description,
  willCloseOnBackButton = true,
}: DrawerUtilProps) => {
  useBackButtonClose(open, () => setOpen(false), { willCloseOnBackButton });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children[0] as React.ReactNode}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          {title && <DialogTitle>{title}</DialogTitle>}
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        {/* Dialog bory */}
        {children[1] as React.ReactNode}
        {/* <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">Save changes</Button>
          </DialogFooter> */}
      </DialogContent>
    </Dialog>
  );
};

export default DialogUtil;
