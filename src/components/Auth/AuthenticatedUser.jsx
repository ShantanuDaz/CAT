import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import { useSnapshot } from "valtio";
import { store } from "../../store/store";
import ErrorBoundary from "../common/ErrorBoundary";
import LoginSignup from "./LoginSignup";
import UserProfile from "./UserProfile";
import App from "../../App";

const AuthenticatedUser = () => {
  const { user } = useSnapshot(store);
  const [showProfile, setShowProfile] = useState(false);

  useEffect(() => {
    const getSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      store.setUser(session?.user ?? null);
    };

    getSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const newUser = session?.user ?? null;
      store.setUser(newUser);

      // Check if Google user needs to set username
      if (
        newUser &&
        newUser.app_metadata?.provider === "google" &&
        !newUser.user_metadata?.username
      ) {
        setShowProfile(true);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  if (showProfile) {
    return <UserProfile onClose={() => setShowProfile(false)} />;
  }

  return <ErrorBoundary>{user ? <App /> : <LoginSignup />}</ErrorBoundary>;
};

export default AuthenticatedUser;
