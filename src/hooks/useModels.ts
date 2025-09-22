import { Idb } from "@/services/indexDB/indexDBService";
import { useModelStore } from "@/zustand/store";

const useModels = (): {
  toggleChatModelIndexDB: (model: Partial<Model>) => Promise<void>;
} => {
  const toggleChatModel = useModelStore((store) => store.toggleChatModel);

  // add and remove currently used models in indexDB
  const toggleChatModelIndexDB = async (model: Partial<Model>) => {
    try {
      // add model if current model doesn't exit in list and remove if it exists
      await Idb.updateData({ data: model, storeName: "currentlyUsedModels" });
      // toggle model on local storage
      toggleChatModel(model);
    } catch (error) {
      console.error(error);
    }
  };

  return { toggleChatModelIndexDB };
};

export default useModels;
