// import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";
// import { api } from "../../api/api";
import { useAuthStore, useChatRoomStore } from "@/zustand/store";
import { useEffect } from "react";
import { axiosConfig } from "@/api/axiosConfig";
import { toast } from "react-toastify";
import Logo from "@/components/utils/Logo";
import { AxiosError } from "axios";
import useDeleteData from "@/hooks/useDeleteData";
// import { toast } from "react-toastify";
// import Loader from "../../components/utils/Loader";

// this component is used to handle the callback from google auth
// when user is redirected to this page after login with google this component's work is get the authorization code from the url and send it to the server to get the user details and create user or login on local auth store
const AuthCallback = () => {
  const [searchParams] = useSearchParams();
  const authorizationCode = searchParams.get("code");
  const { login } = useAuthStore();
  const navigate = useNavigate();

  const { chatRooms } = useChatRoomStore((store) => store);

  const { deleteChatRoom } = useDeleteData();

  useEffect(() => {
    (async () => {
      if (!authorizationCode) {
        navigate("/");
        return;
      }
      try {
        const res = await axiosConfig.post(
          "/auth/google/callback",
          {
            code: authorizationCode,
          },
          { withCredentials: true }
        );

        const { message, user } = res.data.data;
        if (!user) {
          console.log("Login failed! user did not get.");
          toast.error("Login failed! user did not get.");
          navigate("/");
          return;
        }
        login(user);
        toast.success(message);
        navigate("/");
        // for now we delete all local data that user create before login but further we create a router that will handle save data that user create before login in mongoDB database
        await deleteChatRoom({
          chatRoomIds: chatRooms.map((room) => room.chatRoomId),
        });
      } catch (error) {
        console.error(error);
        if (error instanceof AxiosError) {
          if (!error.response?.data.status) {
            navigate("/");
            toast.error(error.response?.data.message);
          }
        } else {
          toast.error("An unknown error occurred.");
        }
      }
    })();
  }, [authorizationCode, login, navigate]);

  return (
    <div className="flex items-center justify-center w-full h-screen">
      <Logo isIconSpin={true} />
    </div>
  );
};

export default AuthCallback;
