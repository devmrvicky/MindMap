import * as React from "react";
import {
  Drawer,
  // DrawerClose,
  DrawerContent,
  DrawerDescription,
  // DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import useBackButtonClose from "@/hooks/useBackButtonClose";

export interface DrawerUtilProps {
  children: React.ReactNode[];
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  title?: string;
  description?: string;
  willCloseOnBackButton?: boolean;
}

const DrawerUtil = ({
  children,
  open,
  setOpen,
  title,
  description,
  willCloseOnBackButton = true,
}: DrawerUtilProps) => {
  useBackButtonClose(open, () => setOpen(false), { willCloseOnBackButton });

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>{children[0] as React.ReactNode}</DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            {title && <DrawerTitle>{title}</DrawerTitle>}
            {description && (
              <DrawerDescription>{description}</DrawerDescription>
            )}
          </DrawerHeader>
          {children[1] as React.ReactNode}
          {/* <DrawerFooter>
            <Button>Submit</Button>
            <DrawerClose asChild>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </DrawerFooter> */}
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default DrawerUtil;
