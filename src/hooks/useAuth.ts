import axiosConfig from "@/axios/axiosConfig";
import { useAuthStore, useChatStore } from "@/zustand/store";
import { AxiosError } from "axios";
import { toast } from "react-toastify";
import useDeleteData from "./useDeleteData";

const useAuth = () => {
  const { chatRooms } = useChatStore((store) => store);
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

  // c
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
      }
    }
  };

  // login auth
  // const loginAuth = async (user: User) => {
  //   login(user)
  // }

  return {
    redirectGoogleAuthUrl,
    logoutAuth,
  };
};

export default useAuth;
