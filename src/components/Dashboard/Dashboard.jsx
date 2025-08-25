import { useEffect, useState } from "react";
import { useSnapshot } from "valtio";
import { store } from "../../store/store";
import Section from "./Section";

const Dashboard = () => {
  const { user } = useSnapshot(store);
  const [loadError, setLoadError] = useState(null);
  const snap = useSnapshot(store);
  useEffect(() => {
    if (user) {
      store.loadTree().catch((error) => {
        const sanitizedError = "Failed to load content tree";
        console.error(sanitizedError);
        setLoadError("Unable to load your content. Please refresh the page.");
      });
    }
  }, [user]);

  if (!user) {
    return (
      <div className="flex items-center justify-center h-full">Loading...</div>
    );
  }

  if (loadError) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <p className="text-red-600">{loadError}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Refresh Page
        </button>
      </div>
    );
  }

  return (
    <main className="h-full p-4 overflow-auto flex gap-4 snap-x snap-mandatory">
      {snap.selectedExam && (
        <Section parentPath={[{ type: "object", name: snap.selectedExam }]} />
      )}
    </main>
  );
};

export default Dashboard;
