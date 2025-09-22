import { useEffect } from "react";
import { Idb } from "@/services/indexDB/indexDBService";
import { useModelStore } from "@/zustand/store.ts";

export function useModelsInit() {
  const setChatModels = useModelStore((s) => s.setChatModels);

  useEffect(() => {
    const loadModels = async () => {
      try {
        const models = (await Idb.getAllData({
          storeName: "currentlyUsedModels",
        })) as Partial<Model>[];
        setChatModels(models);
      } catch (err) {
        console.error("Failed to load models from IndexedDB:", err);
        setChatModels([]); // fallback to empty
      }
    };

    loadModels();
  }, [setChatModels]);
}
