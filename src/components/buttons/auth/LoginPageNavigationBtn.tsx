import { Button } from "../../ui/button";
import { useNavigate } from "react-router";

const LoginPageNavigationBtn = () => {
  const navigate = useNavigate();
  return (
    <Button
      variant="outline"
      className="h-10 w-[100px] px-4 text-base bg-white font-medium cursor-pointer rounded-full"
      onClick={() => {
        navigate("/auth/login");
      }}
    >
      Login
    </Button>
  );
};

export default LoginPageNavigationBtn;
