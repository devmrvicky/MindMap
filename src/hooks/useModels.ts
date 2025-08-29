import { openrouterAxiosConfig } from "@/axios/axiosConfig";
import { getAllData, setAllData, updateData } from "@/indexDB/indexDB";
import { useChatStore } from "@/zustand/store";

interface getModelsPropType {
  forceRefresh?: boolean;
}

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

const useModels = (): {
  getModels: (props: getModelsPropType) => Promise<Model[]>;
  toggleChatModelIndexDB: (model: Partial<Model>) => Promise<void>;
} => {
  const { toggleChatModel } = useChatStore((store) => store);

  // get all models from indexDB if not found then fetch from openrouter and store it in indexDB
  const getModels = async ({
    forceRefresh = false,
  }: getModelsPropType): Promise<Model[]> => {
    let models: Model[] = [];
    if (!forceRefresh) {
      models = (await getAllData({ storeName: "model" })) as Model[];
    }
    if (models.length === 0) {
      console.log("fetch from openrouter");
      const res = await openrouterAxiosConfig.get("/models");
      models = res.data.data as Model[];
      // now set all data to indexDB database
      await setAllData({ data: models, storeName: "model" });
    }
    return models;
  };

  // add and remove currently used models in indexDB
  const toggleChatModelIndexDB = async (model: Partial<Model>) => {
    try {
      // add model if current model doesn't exit in list and remove if it exists
      await updateData({ data: model, storeName: "currentlyUsedModels" });
      // toggle model on local storage
      toggleChatModel(model);
    } catch (error) {
      console.error(error);
    }
  };

  return { getModels, toggleChatModelIndexDB };
};

export default useModels;
