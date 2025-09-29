import { useState } from "react";
import LogoutButton from "../Auth/LogoutButton";
import { store } from "../../store/store";
import { useSnapshot } from "valtio";
import { ChevronDown, Plus } from "lucide-react";
import Exams from "./Exams";
const Header = () => {
  const snap = useSnapshot(store);
  const [isOpen, setIsOpen] = useState(false);
  const exams = Object.keys(snap.content);

  const username =
    snap.user?.user_metadata?.username || snap.user?.email?.split("@")[0] || "User";

  return (
    <header className="shadow p-4 flex justify-between items-center">
      <h1 className="text-2xl flex gap-1 items-center">
        {exams.length > 0 ? (
          <>
            <span>
              <span className="font-bold">{snap.selectedExam} Prep</span>
            </span>
            <button className="p-1 hover:bg-gray-200 rounded-full transition-colors">
              <ChevronDown onClick={() => setIsOpen(true)} />
            </button>
          </>
        ) : (
          <>
            <span>
              <span className="font-bold">Please start your exam perp</span>
            </span>
            <button className="p-1 hover:bg-gray-200 rounded-full transition-colors">
              <Plus onClick={() => setIsOpen(true)} />
            </button>
          </>
        )}
      </h1>
      <div className="flex items-center gap-4">
        <span className="text-xl font-bold">You can do it !! {username}</span>
        <LogoutButton />
      </div>
      {isOpen && <Exams isOpen={isOpen} closeExams={() => setIsOpen(false)} />}
    </header>
  );
};

export default Header;
