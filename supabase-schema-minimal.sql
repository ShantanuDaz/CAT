-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- User content trees table using JSONB
CREATE TABLE user_content_trees (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  content_tree JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Row Level Security (RLS)
ALTER TABLE user_content_trees ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own content tree" ON user_content_trees
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own content tree" ON user_content_trees
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own content tree" ON user_content_trees
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own content tree" ON user_content_trees
  FOR DELETE USING (auth.uid() = user_id);

-- Indexes for JSONB operations
CREATE INDEX idx_user_content_trees_user_id ON user_content_trees(user_id);
CREATE INDEX idx_content_tree_gin ON user_content_trees USING GIN (content_tree);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to auto-update updated_at
CREATE TRIGGER update_user_content_trees_updated_at BEFORE UPDATE ON user_content_trees
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();