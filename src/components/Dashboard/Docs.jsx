import { useState } from "react";
import { Edit, Trash2 } from "lucide-react";
import { useSnapshot } from "valtio";
import { store } from "../../store/store";
import CURDContent from "../common/CURDContent";
const Docs = ({
  topicPath = [],
  topicIndex = null,
  contentType = "Notes",
  contentIndex = null,
}) => {
  const snap = useSnapshot(store);

  let currentLevel = snap.content;
  for (const { type, name, index = 0 } of topicPath) {
    if (type === "object") currentLevel = currentLevel[name];
    else currentLevel = currentLevel.topics[index];
  }

  const topic = currentLevel?.topics[topicIndex] || {};
  const content =
    contentIndex !== null ? topic.contentItems[contentType][contentIndex] : {};

  const [isEditContent, setIsEditContent] = useState(false);
  const [isDeleteContent, setIsDeleteContent] = useState(false);

  return (
    <div className="w-full border rounded-lg cursor-pointer grid grid-cols-[1fr_max-content_max-content] justify-between overflow-hidden">
      <div
        onClick={() => window.open(content.docURL, "_blank")}
        className="p-3 hover:bg-gray-100 overflow-hidden"
      >
        <h3 className="font-medium">{content.name}</h3>
        <p className="text-sm text-gray-500 max-w-xs overflow-hidden whitespace-nowrap text-ellipsis">
          {content.description}
        </p>
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => setIsEditContent(true)}
          className="p-2 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-full transition-colors"
          title="Edit Content"
        >
          <Edit size={20} />
        </button>
        <button
          onClick={() => setIsDeleteContent(true)}
          className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors"
          title="Delete Content"
        >
          <Trash2 size={20} />
        </button>
      </div>
      {(isEditContent || isDeleteContent) && (
        <CURDContent
          isOpen={isEditContent}
          isDelete={isDeleteContent}
          closeModal={() => {
            setIsEditContent(false);
            setIsDeleteContent(false);
          }}
          parentPath={topicPath}
          topicIndex={topicIndex}
          contentIndex={contentIndex}
          contentType={contentType}
        />
      )}
    </div>
  );
};

export default Docs;
