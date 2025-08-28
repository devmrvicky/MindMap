import { SearchIcon } from "lucide-react";

interface ModelSearchInputProps {
  searchModels: (searchParam: string) => void;
}

const ModelSearchInput = ({ searchModels }: ModelSearchInputProps) => {
  const handleModelsSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const searchParam = formData.get("search") as string;
    searchModels(searchParam);
  };

  return (
    <form
      className="w-full max-w-[700px] flex items-center gap-4 border rounded-md p-2 px-4 mx-auto bg-[#151515]"
      onSubmit={handleModelsSearch}
    >
      <SearchIcon />
      <input
        type="search"
        name="search"
        placeholder="Search model..."
        className="w-full border-none outline-none"
      />
    </form>
  );
};

export default ModelSearchInput;
