import { useState } from "react";
import { ChevronRight } from "lucide-react";
import ItemContent from "./ItemContent/ItemContent";
const Item = ({ item, onClick, onDelete }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border rounded-lg cursor-pointer flex justify-between overflow-hidden">
      <div
        className="p-3 hover:bg-gray-100 w-full"
        onClick={() => setIsOpen(true)}
      >
        <h3 className="font-medium">{item.name}</h3>
        <p className="text-sm text-gray-500">{item.description}</p>
      </div>
      <div
        className="border-l-2 p-3 flex hover:bg-gray-100"
        onClick={() => onClick(item)}
      >
        <ChevronRight size={24} className="self-center justify-self-center" />
      </div>
      <ItemContent 
        isOpen={isOpen} 
        closeModal={() => setIsOpen(false)} 
        topicTitle={item.name}
        breadcrumb={item.breadcrumb || item.name}
        topicId={item.id}
        onTopicDeleted={() => {
          setIsOpen(false);
          onDelete?.();
        }}
      />
    </div>
  );
};

export default Item;
