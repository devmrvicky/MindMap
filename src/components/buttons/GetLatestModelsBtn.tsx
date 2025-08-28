import { LoaderCircle } from "lucide-react";
import { Button } from "../ui/button";

type GetLatestModelBtnProps = {
  refreshModels: () => void;
  modelRefreshing: boolean;
};

const GetLatestModelBtn = ({
  refreshModels,
  modelRefreshing,
}: GetLatestModelBtnProps) => {
  return (
    <Button
      variant="outline"
      size="sm"
      className="cursor-pointer"
      onClick={refreshModels}
      disabled={modelRefreshing}
    >
      <LoaderCircle
        className={`${modelRefreshing ? "animate-spin ease-in-out" : ""}`}
      />{" "}
      <span className="hidden sm:inline">Refresh models</span>
    </Button>
  );
};

export default GetLatestModelBtn;
