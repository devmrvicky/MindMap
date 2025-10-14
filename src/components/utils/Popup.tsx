import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogDescription,
} from "@/components/ui/dialog";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import React from "react";
import useBackButtonClose from "@/hooks/useBackButtonClose";

const Popup = ({
  children,
  open,
  setOpen,
  popupTitle,
  popupDescription,
}: {
  children: React.ReactNode[];
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  popupTitle?: string;
  popupDescription?: string;
}) => {
  const isMobile = useIsMobile();

  useBackButtonClose(open, () => setOpen(false), {});

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>{children[0] as React.ReactNode}</DrawerTrigger>
        <DrawerContent className="pb-5">
          <DrawerHeader className="text-left">
            <DrawerTitle> {popupTitle || ""}</DrawerTitle>
            <DrawerDescription>{popupDescription || ""}</DrawerDescription>
          </DrawerHeader>
          {children[1]}
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children[0]}</DialogTrigger>
      <DialogContent className="w-full max-w-md h-auto flex flex-col gap-3">
        <DialogDescription className="text-sm font-semibold">
          {popupDescription || ""}
        </DialogDescription>
        {children[1]}
      </DialogContent>
    </Dialog>
  );
};

export default Popup;
