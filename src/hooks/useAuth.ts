import { useCallback, useEffect } from "react";
import { axiosConfig } from "@/api/axiosConfig";
import { useAuthStore, useChatRoomStore } from "@/zustand/store";
import { AxiosError } from "axios";
import { toast } from "react-toastify";
import useDeleteData from "./useDeleteData";

const useAuth = () => {
  const { chatRooms } = useChatRoomStore((store) => store);
  const { logout } = useAuthStore((store) => store);

  // import delete data function from useDeleteData hook
  const { deleteChatRoom } = useDeleteData();

  // redirect google auth url (when user clicks on google login button it redirect to google auth url on this url "AuthCallback.tsx" component will be rendered)
  const redirectGoogleAuthUrl = async () => {
    try {
      const res = await axiosConfig.get("/auth/google/redirect");
      // Redirect the user to the Google OAuth2 URL
      window.location.href = res.data.OAuth2Url;
      // navigate(res.data.OAuth2Url);
      // * after this step please check out /pages/AuthCallback.tsx page
    } catch (error) {
      console.error(error);
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message);
      } else {
        toast.error("An unknown error occurred.");
      }
    }
  };

  // logout user and delete all data from indexDB
  const logoutAuth = async () => {
    try {
      await axiosConfig.post("/user/logout");
      // logout from client store
      logout();
      toast.success("User logout successfully!", {
        toastId: "logout successfully",
      });
      // delete all data from indexDB
      await deleteChatRoom({
        chatRoomIds: chatRooms.map((chatRoom) => chatRoom.chatRoomId),
      });
    } catch (error) {
      if (error instanceof AxiosError) {
        console.log(`Error while logout `, error.response?.data.message);
        toast.error(error.response?.data.message, {
          toastId: "logout failed",
        });
      } else {
        console.error("An unknown error occurred during logout:", error);
        toast.error("An unknown error occurred during logout.", {
          toastId: "logout failed",
        });
      }
    }
  };

  return {
    redirectGoogleAuthUrl,
    logoutAuth,
  };
};

export const useAuthInit = () => {
  const { login, logout } = useAuthStore((store) => store);
  const checkUserSession = useCallback(async () => {
    try {
      const { data } = await axiosConfig.get("/user");
      data?.user ? login(data.user) : logout();
    } catch (error) {
      logout();
      console.error("User session check failed:", error);
    }
  }, [login, logout]);

  useEffect(() => {
    checkUserSession();
  }, [checkUserSession]);
};

export default useAuth;
