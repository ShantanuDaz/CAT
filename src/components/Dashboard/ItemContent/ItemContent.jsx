import { useState, useEffect } from "react";
import { Modal, Tabs, Tab } from "react-simplicity-lib";
import { Plus, X, Trash2 } from "lucide-react";
import CreateDocForm from "./CreateDocForm";
import DocumentList from "./DocumentList";
import AddTabForm from "./AddTabForm";
import ConfirmDialog from "../../common/ConfirmDialog";
import { contentAPI, topicsAPI } from "../../../api/database";

const ItemContent = ({ isOpen, closeModal, topicTitle, breadcrumb, topicId, onTopicDeleted }) => {
  const [tabTypes, setTabTypes] = useState(["Notes", "Questions", "Tricks"]);
  const [contentItems, setContentItems] = useState({
    notes: [],
    questions: [],
    tricks: [],
  });

  useEffect(() => {
    if (topicId) {
      const allContent = contentAPI.getContentByTopicId(topicId, 'user123');
      const groupedContent = {
        notes: allContent.filter(item => item.type === 'notes'),
        questions: allContent.filter(item => item.type === 'questions'),
        tricks: allContent.filter(item => item.type === 'tricks'),
      };
      
      // Add custom tabs
      const customTabs = [...new Set(allContent.map(item => item.type))]
        .filter(type => !['notes', 'questions', 'tricks'].includes(type));
      
      customTabs.forEach(tab => {
        const tabKey = tab.toLowerCase().replace(/\s+/g, '');
        groupedContent[tabKey] = allContent.filter(item => item.type === tab);
      });
      
      setContentItems(groupedContent);
      
      const allTabs = ['Notes', 'Questions', 'Tricks', ...customTabs.map(tab => 
        tab.charAt(0).toUpperCase() + tab.slice(1)
      )];
      setTabTypes(allTabs);
    }
  }, [topicId]);

  const [showCreateForm, setShowCreateForm] = useState(null);
  const [showAddTabForm, setShowAddTabForm] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState(null);

  const handleCreateDoc = (formData) => {
    const newDoc = contentAPI.createContentItem({
      user_id: 'user123',
      topic_id: topicId,
      type: showCreateForm.toLowerCase(),
      title: formData.name,
      description: formData.description,
      google_doc_id: "1RnrpL5B7YGQvm6CeaGFM9JTivZTL4Xvwf0G1Q2sprEI",
      google_doc_url: "https://docs.google.com/document/d/1RnrpL5B7YGQvm6CeaGFM9JTivZTL4Xvwf0G1Q2sprEI/edit?tab=t.0",
    });

    // Refresh content
    const allContent = contentAPI.getContentByTopicId(topicId, 'user123');
    const groupedContent = {};
    tabTypes.forEach(type => {
      const key = type.toLowerCase().replace(/\s+/g, '');
      groupedContent[key] = allContent.filter(item => item.type === key);
    });
    setContentItems(groupedContent);
    setShowCreateForm(null);
  };

  const handleAddTab = (tabName) => {
    const newTabKey = tabName.toLowerCase().replace(/\s+/g, "");
    setTabTypes((prev) => [...prev, tabName]);
    setContentItems((prev) => ({
      ...prev,
      [newTabKey]: [],
    }));
    setShowAddTabForm(false);
  };

  const handleDeleteTab = (tabName) => {
    if (['Notes', 'Questions', 'Tricks'].includes(tabName)) return;
    
    setConfirmDialog({
      title: 'Delete Tab',
      message: `Delete "${tabName}" tab and all its content? This action cannot be undone.`,
      onConfirm: () => {
        const tabKey = tabName.toLowerCase().replace(/\s+/g, '');
        
        // Delete all content items of this type
        const itemsToDelete = contentItems[tabKey] || [];
        itemsToDelete.forEach(item => contentAPI.deleteContentItem(item.id));
        
        // Remove tab
        setTabTypes(prev => prev.filter(t => t !== tabName));
        setContentItems(prev => {
          const newItems = { ...prev };
          delete newItems[tabKey];
          return newItems;
        });
      }
    });
  };

  const handleDeleteContent = (itemId) => {
    contentAPI.deleteContentItem(itemId);
    
    // Refresh content
    const allContent = contentAPI.getContentByTopicId(topicId, 'user123');
    const groupedContent = {};
    tabTypes.forEach(type => {
      const key = type.toLowerCase().replace(/\s+/g, '');
      groupedContent[key] = allContent.filter(item => item.type === key);
    });
    setContentItems(groupedContent);
  };

  const handleDeleteTopic = () => {
    setConfirmDialog({
      title: 'Delete Topic',
      message: `Delete "${topicTitle}" and all its content? This will also delete all subtopics. This action cannot be undone.`,
      onConfirm: () => {
        topicsAPI.deleteTopic(topicId);
        closeModal();
        onTopicDeleted?.();
      }
    });
  };

  return (
    <>
      <CreateDocForm
        isOpen={!!showCreateForm}
        onClose={() => setShowCreateForm(null)}
        onCreate={handleCreateDoc}
        type={showCreateForm}
        style={{ zIndex: 1000001 }}
      />

      <AddTabForm
        isOpen={showAddTabForm}
        onClose={() => setShowAddTabForm(false)}
        onAddTab={handleAddTab}
        style={{ zIndex: 1000001 }}
      />

      <ConfirmDialog
        isOpen={!!confirmDialog}
        onClose={() => setConfirmDialog(null)}
        onConfirm={confirmDialog?.onConfirm}
        title={confirmDialog?.title}
        message={confirmDialog?.message}
        style={{ zIndex: 9999999 }}
      />

      <Modal isOpen={isOpen} onModalClose={closeModal}>
        <div className="w-[95vw] h-[95vh] grid grid-rows-[max-content_1fr] bg-white rounded-lg overflow-hidden">
          <section className="flex justify-between items-center p-4 border-b">
            <div>
              <h1 className="text-xl font-semibold">{topicTitle}</h1>
              {breadcrumb && (
                <p className="text-sm text-gray-500 mt-1">{breadcrumb}</p>
              )}
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleDeleteTopic}
                className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors"
                title="Delete topic"
              >
                <Trash2 size={20} />
              </button>
              <button
                onClick={closeModal}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>
          </section>
          <Tabs Tabs={[...tabTypes, "+"]} className="w-full h-full">
            {tabTypes.map((type) => (
              <Tab key={type}>
                <div className="h-full flex flex-col">
                  {!['Notes', 'Questions', 'Tricks'].includes(type) && (
                    <div className="flex justify-end p-2 border-b">
                      <button
                        onClick={() => handleDeleteTab(type)}
                        className="text-red-500 hover:text-red-700 p-1"
                        title={`Delete ${type} tab`}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  )}
                  <DocumentList
                    type={type}
                    items={
                      contentItems[type.toLowerCase().replace(/\s+/g, "")] || []
                    }
                    onCreateNew={setShowCreateForm}
                    onDocumentClick={(doc) =>
                      window.open(doc.google_doc_url, "_blank")
                    }
                    onDeleteDocument={handleDeleteContent}
                  />
                </div>
              </Tab>
            ))}
            <Tab key="add-tab">
              <div className="flex items-center justify-center h-full">
                <button
                  onClick={() => setShowAddTabForm(true)}
                  className="flex flex-col items-center gap-2 p-8 text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <Plus size={48} />
                  <span className="text-lg font-medium">Add New Tab</span>
                  <span className="text-sm">Create a custom content type</span>
                </button>
              </div>
            </Tab>
          </Tabs>
        </div>
      </Modal>
    </>
  );
};

export default ItemContent;
