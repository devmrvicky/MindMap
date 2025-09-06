import IndexedDBService from "@/services/indexDB/indexDBService";
import { useModelStore } from "@/zustand/store";

/**
 * useModels is a hook which is responsible for managing the models (e.g. llm, openrouter etc.) in the application.
 * It has two functions, getModels and toggleChatModelIndexDB.
 *
 * getModels is a function which returns all models from indexDB if not found then fetch from openrouter and store it in indexDB.
 *
 * toggleChatModelIndexDB is a function which adds and removes currently used models in indexDB.
 *
 * @returns {Object} - an object with two functions, getModels and toggleChatModelIndexDB.
 */

const Idb = new IndexedDBService();

const useModels = (): {
  toggleChatModelIndexDB: (model: Partial<Model>) => Promise<void>;
} => {
  const { toggleChatModel } = useModelStore((store) => store);

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
