import { Button } from "../ui/button";
import { ChevronRight, ListCollapseIcon } from "lucide-react";
import { useState } from "react";
import Popup from "../utils/Popup";

const UserQueryListPopup = ({ userQueries }: { userQueries: string[] }) => {
  const [open, setOpen] = useState(false);
  return (
    <Popup
      open={open}
      setOpen={setOpen}
      popupTitle="Queries list"
      popupDescription=""
    >
      <TriggerButton setOpen={setOpen} />
      <UserQueryLists userQueries={userQueries} />
    </Popup>
  );
};

const TriggerButton = ({ setOpen }: { setOpen: (open: boolean) => void }) => {
  return (
    <Button variant="ghost" className="" onClick={() => setOpen(true)}>
      <ListCollapseIcon className="min-w-5 min-h-5 flex items-center gap-2 w-full" />{" "}
      <span>Queries list</span>
      <ChevronRight className="min-w-5 min-h-5 ml-auto" />
    </Button>
  );
};

// content
const UserQueryLists = ({ userQueries }: { userQueries: string[] }) => {
  return (
    <ul className="overflow-y-auto flex flex-col p-3">
      {userQueries.map((query, i) => (
        <li
          key={query}
          className="flex items-center py-2 hover:dark:bg-zinc-800 px-2 hover:bg-zinc-200 rounded hover:text-zinc-800 dark:text-zinc-500  cursor-pointer"
        >
          <span className="cursor-pointer">
            {`#${i + 1}. `}
            {query.length > 200 ? `${query.slice(0, 200)}...` : query}
          </span>
        </li>
      ))}
    </ul>
  );
};

export default UserQueryListPopup;
