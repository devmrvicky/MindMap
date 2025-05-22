import { Button } from "@/components/ui/button";
import useAuth from "@/hooks/useAuth";
import { LogOut, LoaderCircle } from "lucide-react";
import { useState } from "react";

const LogoutBtn = () => {
  const [waiting, setWaiting] = useState(false);
  const { logoutAuth } = useAuth();

  const handleLogoutUser = async () => {
    try {
      setWaiting(true);
      await logoutAuth();
    } catch (error) {
      console.log(error);
    } finally {
      setWaiting(false);
    }
  };

  return (
    <Button
      variant="destructive"
      className="w-full bg-white text-red-500 hover:bg-red-500/10 cursor-pointer"
      onClick={handleLogoutUser}
      disabled={waiting}
    >
      {waiting ? (
        <LoaderCircle className="animate-spin" />
      ) : (
        <LogOut className="text-red-500 hover:bg-red-500/10 " />
      )}
      Log out
    </Button>
  );
};

export default LogoutBtn;
