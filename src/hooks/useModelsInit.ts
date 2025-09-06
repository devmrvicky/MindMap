import { useEffect, useCallback } from "react";
import IndexedDBService from "@/services/indexDB/indexDBService";
import { useModelStore } from "@/zustand/store.ts";

const Idb = new IndexedDBService();

export function useModelsInit() {
  const { setChatModels } = useModelStore();

  const loadModels = useCallback(async () => {
    const models = (await Idb.getAllData({
      storeName: "currentlyUsedModels",
    })) as Partial<Model>[];
    setChatModels(models);
  }, [setChatModels]);

  useEffect(() => {
    loadModels();
  }, [loadModels]);
}
