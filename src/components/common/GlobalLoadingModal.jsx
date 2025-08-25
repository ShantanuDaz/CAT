import { Modal } from "react-simplicity-lib";
import { useSnapshot } from "valtio";
import { store } from "../../store/store";

const GlobalLoadingModal = () => {
  const { isUpdating, updateMessage } = useSnapshot(store);

  return (
    <Modal
      isOpen={isUpdating}
      style={{ zIndex: 1000002 }} // Prevent closing during updates
    >
      <div className="w-80 p-8 bg-white rounded-lg text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <h2 className="text-lg font-semibold mb-2">Please Wait</h2>
        <p className="text-gray-600">{updateMessage || "Updating..."}</p>
      </div>
    </Modal>
  );
};

export default GlobalLoadingModal;
