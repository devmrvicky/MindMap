import { useIsMobile } from "@/hooks/use-mobile";
import { useRef } from "react";
// import { useScroll } from "react-scroll-hook";
// import {list-indent-decrease} from ""
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { ListCollapseIcon } from "lucide-react";

export const UserQueryListPopup = ({
  userQueries,
  smoothScrollToBottom,
}: {
  userQueries: string[];
  smoothScrollToBottom: () => void;
}) => {
  const isMobile = useIsMobile();
  const scrollRef = useRef<HTMLElement | null>(null);

  // const handleQueryClick = (query: string) => {
  //   if (scrollRef.current) {
  //     scrollRef.current.scrollIntoView({ behavior: "smooth" });
  //   }
  // };

  // if (isMobile) {
  //   return <DialogTrigger asChild />;
  // } else {
  //   return <DialogContent className="w-full max-w-md" />;
  // }

  return (
    <Dialog>
      <DialogTrigger
        asChild
        className="dark:bg-zinc-950 bg-zinc-50 fixed z-10 top-[80px] right-[50px] curpos-pointer"
      >
        <Button variant="ghost" className="">
          <ListCollapseIcon className="min-w-5 min-h-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="w-full max-w-md h-[500px]">
        <DialogDescription className="text-sm font-semibold">
          Click on any query to scroll to that query
        </DialogDescription>
        <ul className="overflow-y-auto">
          {userQueries.map((query, i) => (
            <li
              key={query}
              className="flex items-center py-2 hover:dark:bg-zinc-800 px-2 hover:bg-zinc-800 rounded text-zinc-500 hover:text-zinc-300 cursor-pointer"
            >
              <span
                className="cursor-pointer"
                onClick={() => smoothScrollToBottom()}
              >
                {`#${i + 1}. `}
                {query.length > 200 ? `${query.slice(0, 200)}...` : query}
              </span>
            </li>
          ))}
        </ul>
      </DialogContent>
    </Dialog>
  );
};
