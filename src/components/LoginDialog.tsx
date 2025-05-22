import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import Logo from "@/components/utils/Logo";
// import GoogleAuthBtn from "../buttons/auth/GoogleAuthBtn";
import { Link } from "react-router";
import GoogleAuthBtn from "./buttons/auth/GoogleAuthBtn";

export default function LoginDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-8" autoFocus={false}>
        <DialogTitle aria-hidden={true} className="sr-only">
          Login dialog
        </DialogTitle>
        <div className="flex flex-col items-center">
          <Logo />
          <h2 className="text-2xl font-bold mt-4 mb-2 text-black text-center">
            Free chats finished
          </h2>
          <p className="text-center text-gray-600 mb-4">
            Your {import.meta.env.VITE_FREE_CHAT_ROOMS} free chats are finished.
            <br />
            Please log in or sign up to continue using MindMap.
          </p>
          <div className="w-full">
            <GoogleAuthBtn />
            <div className="text-center mt-4">
              <span className="text-sm">
                Don't have an account?{" "}
                <Link
                  to="/auth/signup"
                  className="text-green-500 hover:underline"
                >
                  Sign up
                </Link>
              </span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
