import { CircleAlert } from "lucide-react";
import RegenerateResBtn from "./buttons/RegenerateResBtn";

const ErrorResponse = ({
  chatRef,
  errorMessage,
}: {
  chatRef: React.RefObject<HTMLDivElement | null>;
  errorMessage: ErrorResponse["message"];
}) => {
  return (
    <div className="flex mb-10 flex-col justity-start" ref={chatRef}>
      <div className="text-red-500 text-left flex gap-2 items-center bg-red-500/10 px-4 mb-2 p-2 rounded-lg max-w-fit">
        <CircleAlert className="w-6 h-6 mb-2" />
        <p className="text-sm">
          {errorMessage || "An error occurred while processing your request."}
        </p>
      </div>
      <RegenerateResBtn />
    </div>
  );
};

export default ErrorResponse;
