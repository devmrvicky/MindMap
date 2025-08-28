import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "../ui/button";
import { CheckIcon, FilterIcon } from "lucide-react";

interface ModelFilterBtnProps {
  filterModels: (filter: string) => void;
}

const ModelFilterBtn = ({ filterModels }: ModelFilterBtnProps) => {
  const [filters, setFilters] = useState<string[]>([]);

  // NOTE: this function will update in future as no of filters will increase
  const handleFilterModel = (filter: string) => {
    if (filters.includes(filter)) {
      setFilters([]);
    } else {
      setFilters([filter]);
    }
    filterModels(filter);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="">
        <Button variant="outline" size="sm" className="cursor-pointer">
          <FilterIcon />
          <span className="hidden sm:inline">Filter Models</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Filter by</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => handleFilterModel("all")}>
          {filters.includes("all") && <CheckIcon />} All Models
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleFilterModel("free")}>
          {filters.includes("free") && <CheckIcon />} Free
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ModelFilterBtn;
