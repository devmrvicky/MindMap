import { Idb } from "@/services/indexDB/indexDBService";
import { axiosConfig, openrouterAxiosConfig } from "../api/axiosConfig";
import axios from "axios";

type GetChatLlmResponseProps = {
  prompt: string;
  model: string;
  fileUrls?: string[];
  prevResponses?: string;
  signal?: AbortSignal
};

interface GetModelsPropType {
  forceRefresh?: boolean;
}

export default class LlmService {
  // ✅ Get all models from indexDB, or fetch from OpenRouter and cache
  async getAvailableModels({
    forceRefresh = false,
  }: GetModelsPropType): Promise<Model[]> {
    let models: Model[] = [];
    try {
      if (!forceRefresh) {
        models = (await Idb.getAllData({ storeName: "model" })) as Model[];
      }

      if (models.length === 0) {
        console.log("Fetching models from OpenRouter...");
        const res = await openrouterAxiosConfig.get("/models");

        if (res.status !== 200) {
          throw new Error("Failed to fetch models from OpenRouter");
        }

        models = res.data.data as Model[];

        // store into indexDB
        await Idb.setAllData({ data: models, storeName: "model" });
      }

      return models;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : "Unknown error");
    }
  }

  // ✅ Get chat LLM response
  async getChatLlmResponse({
    prompt,
    model,
    fileUrls,
    prevResponses,
    signal
  }: GetChatLlmResponseProps) {
    try {
      // console.log(prevResponses);
      const res = await axiosConfig.post(
        "/llm/text/generate",
        {
          prompt,
          model,
          fileUrls: fileUrls ? JSON.stringify(fileUrls) : [],
          prevResponses,
        },
        {
          signal,
        }
      );

      if (res.status !== 200) {
        throw new Error("Failed to get LLM response");
      }

      return res.data.data;
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : axios.isCancel(error)
          ? `'Request canceled', ${error.message}`
          : "Unknown error"
      );
    }
  }

  // ✅ Get image response
  async getImageResponse({ prompt, model }: { prompt: string; model: string }) {
    try {
      const res = await axiosConfig.post("/llm/image/generate", {
        prompt,
        model,
      });

      if (res.status !== 200) {
        throw new Error("Failed to get LLM image response");
      }

      return res.data.data;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : "Unknown error");
    }
  }

  // ✅ Create abort controller for specific request
  createAbortController(): AbortController {
    return new AbortController();
  }

  // ✅ Fix typo
  cancelRequest(controller: AbortController) {
    console.log(controller)
    controller.abort("User wants to cancel request");
  }
}

export const llmService = new LlmService();
