import { proxy } from "valtio";
import { simpleAPI } from "../api/simpleAPI.js";

// Valtio store
export const store = proxy({
  user: null,
  selectedExam: "",
  content: {},
  isUpdating: false,
  updateMessage: "",

  // Helper to navigate to any path in content tree
  getLevel(path = []) {
    let level = this.content;
    for (const segment of path) {
      if (!level[segment]) return null;
      level = level[segment].children;
    }
    return level;
  },

  // Auth
  setUser(user) {
    this.user = user;
  },

  logout() {
    this.user = null;
    this.content = {};
  },

  // Load tree
  async loadTree() {
    if (!this.user) return;

    try {
      const tree = await simpleAPI.getTree(this.user.id);
      this.content = tree;
      this.selectedExam = Object.keys(this.content)[0];
    } catch (error) {
      console.error("Failed to load tree:", error);
    }
  },

  // Save tree
  async saveTree() {
    if (!this.user) return;

    this.isUpdating = true;
    this.updateMessage = "Saving...";

    try {
      await simpleAPI.saveTree(this.user.id, this.content);
      this.updateMessage = "";
    } catch (error) {
      console.error("Save failed:", error);
      this.updateMessage = "Save failed";
      setTimeout(() => {
        this.updateMessage = "";
      }, 3000);
    } finally {
      this.isUpdating = false;
    }
  },

  // Create topic
  createTopic(parentPath, data) {
    try {
      const level = this.getLevel(parentPath);
      if (!level) {
        console.error("Invalid parent path:", JSON.stringify(parentPath));
        return;
      }

      level[data.name] = {
        name: data.name,
        description: data.description,
        created_at: new Date().toISOString(),
        isExpanded: false,
        children: {},
        contentItems: { notes: [], questions: [], tricks: [] },
      };

      this.saveTree();
    } catch (error) {
      console.error("Failed to create topic:", error);
    }
  },

  // Toggle expansion
  toggleExpansion(parentPath, itemName) {
    const level = this.getLevel(parentPath);
    if (!level) return;

    // Close all siblings, open clicked item
    Object.keys(level).forEach((key) => {
      level[key].isExpanded = key === itemName;
    });
  },

  // Create content with Google Doc
  async createContent(topicPath, contentType, data) {
    try {
      let level = this.content;
      for (const segment of topicPath) {
        if (!level[segment]) {
          console.error("Invalid topic path:", JSON.stringify(topicPath));
          return;
        }
        level = level[segment];
      }

      if (!level.contentItems) {
        level.contentItems = { notes: [], questions: [], tricks: [] };
      }
      if (!level.contentItems[contentType]) {
        level.contentItems[contentType] = [];
      }

      level.contentItems[contentType].push({
        title: data.title,
        description: data.description,
        docUrl: data.docUrl || null,
        created_at: new Date().toISOString(),
      });

      this.saveTree();
    } catch (error) {
      console.error("Failed to create content:", error);
    }
  },

  // Edit topic
  editTopic(topicPath, data) {
    try {
      const parentPath = topicPath.slice(0, -1);
      const oldName = topicPath[topicPath.length - 1];
      const level = this.getLevel(parentPath);

      if (!level || !level[oldName]) {
        console.error("Topic not found:", JSON.stringify(topicPath));
        return;
      }

      // If name changed, move the topic
      if (data.name !== oldName) {
        level[data.name] = { ...level[oldName] };
        delete level[oldName];
      }

      // Update properties
      level[data.name].name = data.name;
      level[data.name].description = data.description;

      this.saveTree();
    } catch (error) {
      console.error("Failed to edit topic:", error);
    }
  },

  // Delete topic
  deleteTopic(topicPath) {
    try {
      const parentPath = topicPath.slice(0, -1);
      const topicName = topicPath[topicPath.length - 1];
      const level = this.getLevel(parentPath);

      if (!level || !level[topicName]) {
        console.error(
          "Topic not found for deletion:",
          JSON.stringify(topicPath)
        );
        return;
      }

      delete level[topicName];
      this.saveTree();
    } catch (error) {
      console.error("Failed to delete topic:", error);
    }
  },

  // Edit content item
  async editContent(topicPath, contentType, itemId, data) {
    try {
      let level = this.content;
      for (const segment of topicPath) {
        if (!level[segment]) {
          console.error("Invalid topic path:", JSON.stringify(topicPath));
          return;
        }
        level = level[segment];
      }

      if (!level.contentItems || !level.contentItems[contentType]) {
        console.error("Content type not found:", contentType);
        return;
      }

      const item = level.contentItems[contentType].find(
        (item) => item.id === itemId
      );
      if (!item) {
        console.error("Content item not found:", itemId);
        return;
      }

      // Update local data
      item.title = data.title;
      item.description = data.description;

      this.saveTree();
    } catch (error) {
      console.error("Failed to edit content:", error);
    }
  },

  // Delete content item
  async deleteContent(topicPath, contentType, itemId) {
    try {
      let level = this.content;
      for (const segment of topicPath) {
        if (!level[segment]) {
          console.error("Invalid topic path:", JSON.stringify(topicPath));
          return;
        }
        level = level[segment];
      }

      if (!level.contentItems || !level.contentItems[contentType]) {
        console.error("Content type not found:", contentType);
        return;
      }

      const itemIndex = level.contentItems[contentType].findIndex(
        (item) => item.id === itemId
      );
      if (itemIndex === -1) {
        console.error("Content item not found:", itemId);
        return;
      }

      // Remove from array
      level.contentItems[contentType].splice(itemIndex, 1);

      this.saveTree();
    } catch (error) {
      console.error("Failed to delete content:", error);
    }
  },
});
