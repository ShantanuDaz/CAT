import { useState, useEffect } from "react";
import { getCurrentUser } from "../../lib/auth";
import LogoutButton from "../Auth/LogoutButton";

const Header = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loadUser = async () => {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    };
    loadUser();
  }, []);

  const username =
    user?.user_metadata?.username || user?.email?.split("@")[0] || "User";

  return (
    <header className="shadow p-4 flex justify-between items-center">
      <h1 className="text-2xl">
        <span className="font-bold">CAT</span> PerP
      </h1>
      <div className="flex items-center gap-4">
        <span className="text-xl font-bold">You can do it !! {username}</span>
        <LogoutButton />
      </div>
    </header>
  );
};

export default Header;
