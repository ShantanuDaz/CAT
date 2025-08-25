import { supabase } from '../lib/supabase.js';

export const simpleAPI = {
  // Get entire content tree for user
  async getTree(userId) {
    if (userId == null) {
      throw new Error('User ID is required');
    }
    
    const { data, error } = await supabase
      .from('user_content_trees')
      .select('content_tree')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) throw error;
    return data?.content_tree || {};
  },

  // Save entire content tree for user
  async saveTree(userId, tree) {
    if (userId == null) {
      throw new Error('User ID is required');
    }
    if (!tree || Array.isArray(tree) || typeof tree !== 'object') {
      throw new Error('Valid tree object is required');
    }
    
    const { error } = await supabase
      .from('user_content_trees')
      .upsert({
        user_id: userId,
        content_tree: tree
      }, {
        onConflict: 'user_id'
      });

    if (error) throw error;
    return true;
  }
};