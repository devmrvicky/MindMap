import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ArrowDownAZ, ArrowDownZA, SortAsc } from "lucide-react";
import { Button } from "../ui/button";

interface ModelSortBtnProps {
  sortModels: (order: "asc" | "desc") => void;
}

const ModelSortBtn = ({ sortModels }: ModelSortBtnProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="">
        <Button variant="outline" size="sm" className="cursor-pointer">
          <SortAsc />
          <span className="hidden sm:inline">Sort Models</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Sort by</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => sortModels("asc")}>
          <ArrowDownAZ /> A to Z
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => sortModels("desc")}>
          <ArrowDownZA /> Z to A
        </DropdownMenuItem>
        {/* <DropdownMenuItem>Most Used</DropdownMenuItem>
        <DropdownMenuItem>Recently Added</DropdownMenuItem> */}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ModelSortBtn;
