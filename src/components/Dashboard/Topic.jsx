import { useState } from "react";
import { ChevronRight, Edit, Trash2 } from "lucide-react";
import Content from "./Content";
import { useSnapshot } from "valtio";
import { store } from "../../store/store";
import CURDTopic from "../common/CURDTopic";
const Topic = ({ openTopic, topicPath = [], topicIndex = null }) => {
  const snap = useSnapshot(store);

  let currentLevel = snap.content;
  for (const { type, name, index = 0 } of topicPath) {
    if (type === "object") currentLevel = currentLevel[name];
    else currentLevel = currentLevel.topics[index];
  }

  const topic = currentLevel?.topics[topicIndex] || {};

  const [isEditTopic, setIsEditTopic] = useState(false);
  const [isDeleteTopic, setIsDeleteTopic] = useState(false);
  const [isContentOpen, setIsContentOpen] = useState(false);

  return (
    <div className="w-full border rounded-lg cursor-pointer grid grid-cols-[1fr_max-content_max-content] justify-between overflow-hidden">
      <div
        onClick={() => setIsContentOpen(true)}
        className="p-3 hover:bg-gray-100 overflow-hidden"
      >
        <h3 className="font-medium">{topic.name}</h3>
        <p className="text-sm text-gray-500 max-w-xs overflow-hidden whitespace-nowrap text-ellipsis">
          {topic.description}
        </p>
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => setIsEditTopic(true)}
          className="p-2 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-full transition-colors"
          title="Edit topic"
        >
          <Edit size={20} />
        </button>
        <button
          onClick={() => setIsDeleteTopic(true)}
          className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors"
          title="Delete topic"
        >
          <Trash2 size={20} />
        </button>
      </div>
      <div
        className="border-l-2 p-3 flex hover:bg-gray-100"
        onClick={() => openTopic()}
      >
        <ChevronRight size={24} className="self-center justify-self-center" />
      </div>
      <Content
        isOpen={isContentOpen}
        closeModal={() => setIsContentOpen(false)}
        topicPath={topicPath}
        topicIndex={topicIndex}
      />
      {isEditTopic ||
        (isDeleteTopic && (
          <CURDTopic
            isOpen={isEditTopic}
            isDelete={isDeleteTopic}
            closeModal={() => {
              setIsEditTopic(false);
              setIsDeleteTopic(false);
            }}
            parentPath={topicPath}
            topicIndex={topicIndex}
          />
        ))}
    </div>
  );
};

export default Topic;
