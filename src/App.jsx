import Dashboard from "./components/Dashboard/Dashboard";
import Footer from "./components/Footer/Footer";
import Header from "./components/Header/Header";
import GlobalLoadingModal from "./components/common/GlobalLoadingModal";

const App = () => {
  return (
    <>
      <Header />
      <Dashboard />
      <Footer />
      <GlobalLoadingModal />
    </>
  );
};

export default App;
