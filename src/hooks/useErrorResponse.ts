import { Idb } from "@/services/indexDB/indexDBService";
import useModelStore from "@/zustand/modelStore";
import { useEffect, useState } from "react";
import { useParams } from "react-router";

const useErrorResponse = (): ErrorResponse | null => {
  // create error obj in indexDB when an error occur
  // keep error until user regenerate response
  // delete error obj from indexDB when user regenerate response

  const [error, setError] = useState<ErrorResponse | null>(null);

  const LLMResponsedError = useModelStore((store) => store.LLMResponsedError);

  const { chatRoomId } = useParams();

  if (!chatRoomId) {
    return error;
  }

  // get error when chat room id change
  useEffect(() => {
    const fetchError = async () => {
      const result = await Idb.getData({
        storeName: "errorResponse",
        id: chatRoomId,
      });
      setError(result as ErrorResponse);
    };
    fetchError();
  }, [chatRoomId]);

  // create error when an error occur and delete error when user regenerate response
  useEffect(() => {
    if (!LLMResponsedError) {
      Idb.deleteData({ storeName: "errorResponse", id: chatRoomId! });
      setError(null);
      return;
    }
    const errorObj: ErrorResponse = {
      id: chatRoomId,
      errorType: "error",
      message: LLMResponsedError,
      success: false,
    };
    setError(errorObj as ErrorResponse);
    Idb.updateData({ data: errorObj, storeName: "errorResponse" });
  }, [LLMResponsedError]);

  return error;
};

export default useErrorResponse;
