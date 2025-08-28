import { openrouterAxiosConfig } from "@/axios/axiosConfig";
import { getAllData, setAllData } from "@/indexDB/indexDB";

interface getModelsPropType {
  forceRefresh?: boolean;
}

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

export default getModels;
