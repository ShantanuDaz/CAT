import { useState, useEffect, useRef } from "react";
import { Plus, ChevronRight } from "lucide-react";
import { topicsAPI } from "../../api/database";
import Item from "./Item";
import CreateTopicForm from "./CreateTopicForm";

const Column = ({ title, parentId, userId, breadcrumb = "" }) => {

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [nextColumn, setNextColumn] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const columnRef = useRef(null);

  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      try {
        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 300));

        const data =
          parentId === null
            ? topicsAPI.getRootTopics(userId)
            : topicsAPI.getTopicsByParentId(parentId, userId);

        setItems(data);
      } catch (error) {
        console.error("Failed to fetch items:", error);
        setItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, [parentId, userId]);

  // Reset nextColumn when parentId changes (when parent column selection changes)
  useEffect(() => {
    setNextColumn(null);
  }, [parentId]);

  const handleItemClick = (item) => {
    // Always create next column, even if no subtopics exist
    const newBreadcrumb = breadcrumb
      ? `${breadcrumb} > ${item.name}`
      : item.name;

    setNextColumn({
      title: item.name,
      parentId: item.id,
      breadcrumb: newBreadcrumb,
    });

    // Scroll new column into view with timeout
    setTimeout(() => {
      // Find the next column section after the chevron
      const parentContainer = columnRef.current?.parentElement;
      if (parentContainer) {
        const allSections = parentContainer.querySelectorAll('section');
        const currentIndex = Array.from(allSections).indexOf(columnRef.current);
        const nextColumnElement = allSections[currentIndex + 1];
        
        if (nextColumnElement) {
          nextColumnElement.scrollIntoView({
            behavior: "smooth",
            block: "nearest",
            inline: "start",
          });
        }
      }
    }, 300);
  };

  const handleAddClick = () => {
    setShowCreateForm(true);
  };

  const handleCreateTopic = (formData) => {
    const newTopic = topicsAPI.createTopic({
      user_id: userId,
      name: formData.name,
      description: formData.description,
      parent_id: parentId,
      order_index: items.length + 1
    });
    
    setItems(prev => [...prev, newTopic]);
    setShowCreateForm(false);
  };

  const refreshItems = () => {
    const data =
      parentId === null
        ? topicsAPI.getRootTopics(userId)
        : topicsAPI.getTopicsByParentId(parentId, userId);
    setItems(data);
  };

  return (
    <>
      <CreateTopicForm
        isOpen={showCreateForm}
        onClose={() => setShowCreateForm(false)}
        onCreate={handleCreateTopic}
        parentTitle={parentId ? title : null}
      />
      
      <section
        ref={columnRef}
        className="min-w-80 max-w-80 border rounded-lg p-4 bg-white grid grid-rows-[max-content_1fr_max-content] animate-slide-in scroll-ml-4"
      >
        <h2 className="text-lg font-semibold mb-4">{title}</h2>
        <div className="overflow-y-auto max-h-full space-y-2">
          {loading ? (
            <div className="text-center text-gray-500 py-8">
              <p>Loading...</p>
            </div>
          ) : items.length > 0 ? (
            items.map((item) => {
              const itemBreadcrumb = breadcrumb
                ? `${breadcrumb} > ${item.name}`
                : item.name;

              return (
                <Item
                  key={item.id}
                  item={{
                    ...item,
                    breadcrumb: itemBreadcrumb,
                  }}
                  onClick={handleItemClick}
                  onDelete={refreshItems}
                />
              );
            })
          ) : (
            <div className="text-center text-gray-500 py-8">
              <p>No items yet</p>
              <p className="text-sm">Click + to add items</p>
            </div>
          )}
        </div>
        <button
          onClick={handleAddClick}
          className="w-full p-3 cursor-pointer border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 hover:bg-gray-50 flex items-center justify-center text-gray-500 hover:text-gray-600"
        >
          <Plus size={20} />
        </button>
      </section>

      {nextColumn && (
        <>
          <ChevronRight size={24} className="self-center" />
          <Column
            title={nextColumn.title}
            parentId={nextColumn.parentId}
            userId={userId}
            breadcrumb={nextColumn.breadcrumb}
          />
        </>
      )}
    </>
  );
};

export default Column;
