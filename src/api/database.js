// Fake database using localStorage to persist data
let mockTopics = [];
let mockContentItems = [];

// Initialize from localStorage
const initializeData = () => {
  const savedTopics = localStorage.getItem('mockTopics');
  const savedContent = localStorage.getItem('mockContentItems');
  
  if (savedTopics) mockTopics = JSON.parse(savedTopics);
  if (savedContent) mockContentItems = JSON.parse(savedContent);
};

// Save to localStorage
const saveData = () => {
  localStorage.setItem('mockTopics', JSON.stringify(mockTopics));
  localStorage.setItem('mockContentItems', JSON.stringify(mockContentItems));
};

// Initialize on load
initializeData();

// Topics API
export const topicsAPI = {
  getRootTopics: (userId) => {
    return mockTopics.filter(topic => 
      topic.parent_id === null && topic.user_id === userId
    ).sort((a, b) => a.order_index - b.order_index);
  },

  getTopicsByParentId: (parentId, userId) => {
    return mockTopics.filter(topic => 
      topic.parent_id === parentId && topic.user_id === userId
    ).sort((a, b) => a.order_index - b.order_index);
  },

  createTopic: (topicData) => {
    const newTopic = {
      id: Date.now().toString(),
      ...topicData,
      created_at: new Date().toISOString()
    };
    mockTopics.push(newTopic);
    saveData();
    return newTopic;
  },

  deleteTopic: (topicId) => {
    // Delete topic and all its children recursively
    const deleteRecursive = (id) => {
      const children = mockTopics.filter(t => t.parent_id === id);
      children.forEach(child => deleteRecursive(child.id));
      
      mockTopics = mockTopics.filter(t => t.id !== id);
      mockContentItems = mockContentItems.filter(c => c.topic_id !== id);
    };
    
    deleteRecursive(topicId);
    saveData();
  }
};

// Content Items API
export const contentAPI = {
  getContentByTopicId: (topicId, userId) => {
    return mockContentItems.filter(item => 
      item.topic_id === topicId && item.user_id === userId
    );
  },

  createContentItem: (contentData) => {
    const newItem = {
      id: Date.now().toString(),
      ...contentData,
      created_at: new Date().toISOString()
    };
    mockContentItems.push(newItem);
    saveData();
    return newItem;
  },

  deleteContentItem: (itemId) => {
    mockContentItems = mockContentItems.filter(item => item.id !== itemId);
    saveData();
  }
};