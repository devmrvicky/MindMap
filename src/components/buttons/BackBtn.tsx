import { useCallback } from "react";
import { useNavigate } from "react-router";
import { Button } from "../ui/button";
import { ChevronLeft } from "lucide-react";

const BackBtn = () => {
  const navigate = useNavigate();
  const handleClick = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  return (
    <Button onClick={handleClick}>
      <ChevronLeft className="w-4 h-4 mr-2 cursor-pointer" />
      Back
    </Button>
  );
};

export default BackBtn;
