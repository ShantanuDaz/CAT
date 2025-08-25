import * as DOMPurify from "dompurify";
import { useState } from "react";
import { Modal } from "react-simplicity-lib";
import { store } from "../../store/store";
import ConfirmDialog from "./ConfirmDialog";

const CURDTopic = ({
  isOpen = false,
  closeModal,
  topicIndex = null,
  parentPath = [],
  isDelete = false,
}) => {
  let currentLevel = store.content;
  for (const { type, name, index } of parentPath) {
    if (type === "object") currentLevel = currentLevel[name];
    else currentLevel = currentLevel.topics[index];
  }
  const topic = topicIndex !== null ? currentLevel.topics[topicIndex] : {};
  const [topicName, setTopicName] = useState(topic?.name || "");
  const [desName, setDesName] = useState(topic?.description || "");

  const handleCreateAndEdit = () => {
    if (validate() === false) {
      alert("Empty Field");
      return;
    }
    if (checkDuplicate() === true) {
      alert("Duplicate topic name");
      return;
    }
    const sanitizedTopicName = DOMPurify.default.sanitize(topicName);
    const sanitizedDesName = DOMPurify.default.sanitize(desName);
    if (topicIndex !== null) {
      currentLevel.topics[topicIndex] = {
        ...currentLevel.topics[topicIndex],
        name: sanitizedTopicName,
        description: sanitizedDesName,
        update_at: new Date().toISOString(),
      };
    } else {
      currentLevel.topics.push({
        name: sanitizedTopicName,
        description: sanitizedDesName,
        created_at: new Date().toISOString(),
        topics: [],
        contentItems: { Notes: [], Questions: [], Tricks: [] },
      });
    }
    store.saveTree();
    closeModal();
  };

  const validate = () => {
    if (!topicName) return false;
    return true;
  };

  const checkDuplicate = () => {
    if (topicIndex !== null) return false;
    return currentLevel.topics.some((topic) => topic.name === topicName);
  };

  const handleDelete = () => {
    currentLevel.topics.splice(topicIndex, 1);
    store.saveTree();
    closeModal();
  };
  return (
    <>
      <Modal
        isOpen={isOpen}
        onModalClose={closeModal}
        style={{ zIndex: 1000001 }}
      >
        <div className="w-96 p-6 bg-white rounded-lg">
          <h2 className="text-lg font-semibold mb-4">
            Add Topic in {currentLevel.name}
          </h2>
          <div className="mb-4">
            <label
              className="block text-sm font-medium mb-1"
              htmlFor="topicName"
            >
              Topic Name
            </label>
            <input
              id="topicName"
              type="text"
              value={topicName}
              onChange={(e) => setTopicName(e.target.value)}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1" htmlFor="desName">
              Description
            </label>
            <textarea
              id="desName"
              rows={4}
              value={desName}
              onChange={(e) => setDesName(e.target.value)}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
              placeholder="Enter description..."
            />
          </div>
          <div className="flex gap-2 mt-6">
            <button
              onClick={() => closeModal()}
              className="flex-1 px-4 py-2 border rounded hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={() => handleCreateAndEdit()}
              className="flex-1 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
            >
              Save
            </button>
          </div>
        </div>
      </Modal>
      <ConfirmDialog
        isOpen={isDelete}
        onClose={() => closeModal()}
        onConfirm={handleDelete}
        title={"Confrim Delete"}
        message={`Do you want to delete ${currentLevel.topics[topicIndex]?.name} in ${currentLevel.name}`}
      />
    </>
  );
};

export default CURDTopic;
