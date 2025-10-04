import { Button } from "../../ui/button";
import { useNavigate } from "react-router";

const SignupPageNavigationBtn = () => {
  const navigate = useNavigate();
  return (
    <Button
      variant="outline"
      className="min-[520px]:h-10 min-[520px]:w-[100px] px-4 text-base bg-white font-medium cursor-pointer rounded-full"
      onClick={() => {
        navigate("/auth/signup");
      }}
    >
      Signup
    </Button>
  );
};

export default SignupPageNavigationBtn;
