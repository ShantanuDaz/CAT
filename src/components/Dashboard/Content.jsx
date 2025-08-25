import { useState, useEffect } from "react";
import { Modal, Tabs, Tab } from "react-simplicity-lib";
import { Plus, X, Edit, Trash2 } from "lucide-react";
import Docs from "./Docs";
import { useSnapshot } from "valtio";
import { store } from "../../store/store";
import CURDContent from "../common/CURDContent";

const Content = ({ isOpen, closeModal, topicPath = [], topicIndex = null }) => {
  const snap = useSnapshot(store);
  const [isAddContent, setIsAddContent] = useState(false);
  let currentLevel = snap.content;
  for (const { type, name, index = 0 } of topicPath) {
    if (type === "object") currentLevel = currentLevel[name];
    else currentLevel = currentLevel.topics[index];
  }
  const topic = currentLevel?.topics[topicIndex] || {};
  const content = topic.contentItems || {};
  const contentTypes = Object.keys(content);

  return (
    <>
      <Modal isOpen={isOpen} onModalClose={closeModal}>
        <div className="w-[95vw] h-[95vh] grid grid-rows-[max-content_1fr] bg-white rounded-lg overflow-hidden">
          <section className="flex justify-between items-center p-4 border-b">
            <div>
              <h1 className="text-xl font-semibold">{topic.name}</h1>
              {topic?.description && (
                <p className="text-sm text-gray-600 mt-1">
                  {topic.description}
                </p>
              )}
            </div>
            <div className="flex gap-2">
              <button
                onClick={closeModal}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>
          </section>
          <Tabs Tabs={contentTypes} className="w-full h-full">
            {contentTypes.map((type, id) => (
              <Tab key={id}>
                <div key={id}>
                  {content[type]?.length === 0 ? (
                    <div className="text-center text-gray-500 py-8">
                      <p>No items yet</p>
                      <p className="text-sm">Click + to add items</p>
                    </div>
                  ) : (
                    content[type]?.map((item, index) => (
                      <Docs
                        key={index}
                        contentType={type}
                        topicPath={topicPath}
                        topicIndex={topicIndex}
                        contentIndex={index}
                      />
                    ))
                  )}
                  <button
                    onClick={() => setIsAddContent(type)}
                    className="w-full p-3 cursor-pointer border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 hover:bg-gray-50 flex items-center justify-center text-gray-500 hover:text-gray-600"
                  >
                    <Plus size={20} />
                  </button>
                </div>
              </Tab>
            ))}
          </Tabs>
        </div>
      </Modal>
      {isAddContent && (
        <CURDContent
          isOpen={isAddContent}
          closeModal={() => setIsAddContent(false)}
          parentPath={topicPath}
          topicIndex={topicIndex}
          contentType={isAddContent}
        />
      )}
    </>
  );
};

export default Content;
