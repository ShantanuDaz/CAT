import Column from "./Column";

const Dashboard = () => {
  const userId = "user123";

  return (
    <main className="h-full p-4 overflow-auto flex gap-4">
      <Column title="Topics" parentId={null} userId={userId} />
    </main>
  );
};

export default Dashboard;
