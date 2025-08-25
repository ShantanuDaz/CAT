import { useRef } from "react";
import { useEffect, useState } from "react";
import { ChevronRight, Plus, X } from "lucide-react";
import { useSnapshot } from "valtio";
import { store } from "../../store/store";
import Topic from "./Topic";
import CURDTopic from "../common/CURDTopic";
import { Modal } from "react-simplicity-lib";

const Section = ({ parentPath = [] }) => {
  const [isAddEditinTopics, setIsAddEditinTopics] = useState(false);
  const [isTopicExpanded, setIsTopicExpanded] = useState(false);
  const [edittingTopicIndex, setEdittingTopicIndex] = useState(null);
  const snap = useSnapshot(store);
  const myRef = useRef(null);

  let currentLevel = snap.content;
  for (const { type, name, index = 0 } of parentPath) {
    if (type === "object") currentLevel = currentLevel[name];
    else currentLevel = currentLevel.topics[index];
  }

  const topics = currentLevel?.topics || [];

  useEffect(() => {
    setIsTopicExpanded(false);
    if (myRef.current) {
      myRef.current.scrollIntoView({
        behavior: "smooth",
        inline: "start",
        block: "nearest",
      });
    }
  }, [JSON.stringify(parentPath), JSON.stringify(topics)]);

  return (
    <>
      <section
        ref={myRef}
        className="min-w-80 max-w-80 border rounded-lg p-2 bg-white grid grid-rows-[max-content_1fr_max-content] animate-slide-in snap-start"
      >
        <h2 className="text-lg font-semibold mb-4">
          {currentLevel?.name || ""}
        </h2>
        <div className="overflow-y-auto max-h-full space-y-2">
          {topics.length > 0 ? (
            topics.map((topic, id) => (
              <Topic
                key={id}
                topic={topic}
                topicIndex={id}
                openTopic={() => {
                  if (id === isTopicExpanded) setIsTopicExpanded(false);
                  else setIsTopicExpanded(id);
                }}
                topicPath={[...parentPath]}
              />
            ))
          ) : (
            <div className="text-center text-gray-500 py-8">
              <p>No items yet</p>
              <p className="text-sm">Click + to add items</p>
            </div>
          )}
        </div>
        <button
          onClick={() => setIsAddEditinTopics(true)}
          className="w-full p-3 cursor-pointer border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 hover:bg-gray-50 flex items-center justify-center text-gray-500 hover:text-gray-600"
        >
          <Plus size={20} />
        </button>
      </section>

      {isTopicExpanded !== false && (
        <>
          <ChevronRight size={24} className="self-center" />
          <Section
            parentPath={[
              ...parentPath,
              {
                type: "array",
                index: isTopicExpanded,
                name: currentLevel.name,
              },
            ]}
          />
        </>
      )}

      {isAddEditinTopics && (
        <CURDTopic
          isOpen={isAddEditinTopics}
          closeModal={() => setIsAddEditinTopics(false)}
          parentPath={parentPath}
          topicIndex={edittingTopicIndex}
        />
      )}
    </>
  );
};

export default Section;
