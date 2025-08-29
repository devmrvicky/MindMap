/*
1. when this page will load, it will get available models from indexDB database.
2. If no models are there, it will fetch from openrouter and store in indexDB.
3. there will be a button to refresh the models list from openrouter.
*/

import { Suspense, useState } from "react";
import { MagicCard } from "@/components/magicui/magic-card";
import useModels from "@/hooks/useModels";
import { useEffect } from "react";
import { toast } from "react-toastify";
import ModelSortBtn from "@/components/buttons/ModelSortBtn";
import ModelSearchInput from "@/components/ModelSearchInput";
import { Switch } from "@/components/ui/switch";
import { useChatStore } from "@/zustand/store";
import GetLatestModelBtn from "@/components/buttons/GetLatestModelsBtn";
import ModelFilterBtn from "@/components/buttons/ModelFilterBtn";
import CopyBtn from "@/components/buttons/CopyBtn";

const Models = () => {
  const [modelRefreshing, setModelRefreshing] = useState(false);
  const [currentAvailableModels, setCurrentAvailableModels] = useState<Model[]>(
    []
  );

  const { getModels, toggleChatModelIndexDB } = useModels();

  // get model list and toggle model function
  const { chatModels } = useChatStore((state) => state);
  console.log({ chatModels });

  // search models
  const searchModels = (searchParam: string) => {
    setCurrentAvailableModels((prevModels) =>
      prevModels.filter((model) =>
        model.name.toLowerCase().includes(searchParam.toLowerCase())
      )
    );
  };

  // filter models based on filter parameter
  const filterModels = (filter: string) => {
    // if filter is all, show all models
    if (filter === "all") {
      (async () => {
        const models = await getModels({});
        setCurrentAvailableModels(models);
      })();
      return;
    }
    // else filter the models based on filter
    const filteredModels = currentAvailableModels.filter((model) => {
      // for free models, check if pricing is 0 for prompt and completion
      if (filter === "free") {
        return (
          parseFloat(model.pricing.prompt) === 0 &&
          parseFloat(model.pricing.completion) === 0
        );
      }
      return false;
    });
    setCurrentAvailableModels(filteredModels);
  };

  // sort models (z to a, a to z)
  const sortModels = (order: "asc" | "desc") => {
    const sortedModels = [...currentAvailableModels].sort((a, b) => {
      if (order === "asc") {
        return a.name.localeCompare(b.name);
      } else {
        return b.name.localeCompare(a.name);
      }
    });
    setCurrentAvailableModels(sortedModels);
  };

  const refreshModels = async () => {
    try {
      setModelRefreshing(true);
      const models = await getModels({ forceRefresh: true });
      setCurrentAvailableModels(models);
    } catch (error) {
      toast.error("Error refreshing models", {
        toastId: "model-refresh-error",
      });
    } finally {
      setModelRefreshing(false);
    }
  };

  const handleCheckedChange = (model: Model) => {
    if (chatModels.length === 1) {
      if (chatModels[0].id === model.id) {
        toast.error("Atleast one model should be selected", {
          toastId: "atleast-one-model",
        });
        return;
      }
    }
    toggleChatModelIndexDB({
      id: model.id,
      name: model.name,
      label: model.name.includes("(free)") ? "free" : "paid",
    });
  };

  useEffect(() => {
    (async () => {
      const models = await getModels({});
      setCurrentAvailableModels(models);
    })();
  }, []);

  return (
    <section className="p-4 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold mb-4">Available Models</h1>
        <div className="flex items-center gap-2">
          <GetLatestModelBtn
            refreshModels={refreshModels}
            modelRefreshing={modelRefreshing}
          />
          <ModelSortBtn sortModels={sortModels} />
          <ModelFilterBtn filterModels={filterModels} />
        </div>
      </div>

      {/* model search input */}
      <ModelSearchInput searchModels={searchModels} />

      <Suspense fallback={<div>Loading models...</div>}>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
          {currentAvailableModels.map((model) => (
            <MagicCard key={model.id} className="p-2 rounded cursor-pointer">
              <div className="flex justify-between">
                <h2 className="text-lg mb-2">{model.name}</h2>
                <Switch
                  checked={
                    chatModels.find((m) => m.id === model.id) ? true : false
                  }
                  onCheckedChange={() => handleCheckedChange(model)}
                  className="cursor-pointer"
                />
              </div>
              <div className="flex items-center gap-4 mb-1">
                <span className="text-xs">{model.id}</span>
                <CopyBtn
                  text={model.id}
                  className="border-none p-0 bg-transparent"
                />
              </div>
              <p className="text-gray-600 mb-2">
                {model.description.slice(0, 100) + "..."}
              </p>
              <p className="text-sm text-gray-500 mb-1">
                Context Length: {model.context_length} tokens
              </p>
            </MagicCard>
          ))}
        </div>
      </Suspense>
    </section>
  );
};

export default Models;
