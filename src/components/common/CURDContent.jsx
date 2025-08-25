import * as DOMPurify from "dompurify";
import { useState } from "react";
import { Modal } from "react-simplicity-lib";
import { store } from "../../store/store";
import ConfirmDialog from "./ConfirmDialog";

const CURDContent = ({
  isOpen = false,
  closeModal,
  topicIndex = null,
  parentPath = [],
  isDelete = false,
  contentType = "Notes",
  contentIndex = null,
}) => {
  let currentLevel = store.content;
  for (const { type, name, index } of parentPath) {
    if (type === "object") currentLevel = currentLevel[name];
    else currentLevel = currentLevel.topics[index];
  }
  const topic = topicIndex !== null ? currentLevel.topics[topicIndex] : {};
  const content =
    contentIndex !== null ? topic.contentItems[contentType][contentIndex] : {};

  const [contentName, setContentName] = useState(content?.name || "");
  const [desName, setDesName] = useState(content?.description || "");
  const [docURL, setDocURL] = useState(content?.docURL || "");

  const handleCreateAndEdit = () => {
    if (validate() === false) {
      alert("Empty Field");
      return;
    }
    if (checkDuplicate() === true) {
      alert("Duplicate topic name");
      return;
    }
    const sanitizeContentName = DOMPurify.default.sanitize(contentName);
    const sanitizeDesName = DOMPurify.default.sanitize(desName);
    const sanitizeDocURL = DOMPurify.default.sanitize(docURL);
    if (contentIndex !== null) {
      topic.contentItems[contentType][contentIndex] = {
        ...topic.contentItems[contentType][contentIndex],
        name: sanitizeContentName,
        description: sanitizeDesName,
        docURL: sanitizeDocURL,
        update_at: new Date().toISOString(),
      };
    } else {
      topic.contentItems[contentType].push({
        name: sanitizeContentName,
        description: sanitizeDesName,
        docURL: sanitizeDocURL,
        created_at: new Date().toISOString(),
      });
    }
    store.saveTree();
    closeModal();
  };

  const validate = () => {
    if (!contentName) return false;
    if (!docURL) return false;
    return true;
  };

  const checkDuplicate = () => {
    if (contentIndex !== null) return false;
    return topic.contentItems[contentType].some(
      (content) => content.name === contentName
    );
  };

  const handleDelete = () => {
    topic.contentItems[contentType].splice(contentIndex, 1);
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
            Add {contentType} in {topic.name}
          </h2>
          <div className="mb-4">
            <label
              className="block text-sm font-medium mb-1"
              htmlFor="contentName"
            >
              Topic Name
            </label>
            <input
              id="contentName"
              type="text"
              value={contentName}
              onChange={(e) => setContentName(e.target.value)}
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
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1" htmlFor="docURL">
              Doc URL
            </label>
            <input
              id="docURL"
              type="url"
              value={docURL}
              onChange={(e) => setDocURL(e.target.value)}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
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
        message={`Do you want to delete ${topic.contentItems[contentType][contentIndex]?.name} in ${topic.name}`}
      />
    </>
  );
};

export default CURDContent;
