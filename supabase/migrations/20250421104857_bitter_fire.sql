/*
  # Initial Schema for Local Services Marketplace App

  1. New Tables
    - `users` - Stores all users (customers, vendors, admins)
    - `chats` - Stores chat sessions between customers and vendors
    - `messages` - Stores individual messages in chats

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users

  3. Extensions
    - Add pgcrypto for UUID generation
*/

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Users Table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone_number TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  password TEXT NOT NULL,
  user_type TEXT NOT NULL CHECK (user_type IN ('customer', 'vendor', 'admin')),
  avatar_url TEXT,
  service_type TEXT,
  service_details TEXT,
  location_url TEXT,
  is_approved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Chat Sessions Table
CREATE TABLE IF NOT EXISTS chats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  vendor_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(customer_id, vendor_id)
);

-- Messages Table
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chat_id UUID NOT NULL REFERENCES chats(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  has_location BOOLEAN DEFAULT FALSE,
  location_url TEXT,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Create Admin User
INSERT INTO users (
  phone_number,
  name,
  password,
  user_type,
  is_approved
) VALUES (
  '0500000000',
  'Admin User',
  '$2b$10$zRLeVXnL.Z2jIh96YdFcDe9LXq0AUy1eGJVN2uVx57x4ZOK8YzAcu', -- 'admin123'
  'admin',
  TRUE
) ON CONFLICT (phone_number) DO NOTHING;

-- RLS Policies

-- Users Policies
CREATE POLICY "Users can read own data" ON users
  FOR SELECT
  USING (id = (current_setting('request.jwt.claims')::json->>'userId')::UUID);

CREATE POLICY "Admin can manage all users" ON users
  USING ((current_setting('request.jwt.claims')::json->>'userType')::TEXT = 'admin');

-- Chats Policies
CREATE POLICY "Users can read their own chats" ON chats
  FOR SELECT
  USING (
    customer_id = (current_setting('request.jwt.claims')::json->>'userId')::UUID OR
    vendor_id = (current_setting('request.jwt.claims')::json->>'userId')::UUID
  );

CREATE POLICY "Users can create their own chats" ON chats
  FOR INSERT
  WITH CHECK (
    customer_id = (current_setting('request.jwt.claims')::json->>'userId')::UUID OR
    vendor_id = (current_setting('request.jwt.claims')::json->>'userId')::UUID
  );

-- Messages Policies
CREATE POLICY "Users can read messages in their chats" ON messages
  FOR SELECT
  USING (
    chat_id IN (
      SELECT id FROM chats WHERE
        customer_id = (current_setting('request.jwt.claims')::json->>'userId')::UUID OR
        vendor_id = (current_setting('request.jwt.claims')::json->>'userId')::UUID
    )
  );

CREATE POLICY "Users can insert messages in their chats" ON messages
  FOR INSERT
  WITH CHECK (
    sender_id = (current_setting('request.jwt.claims')::json->>'userId')::UUID AND
    chat_id IN (
      SELECT id FROM chats WHERE
        customer_id = (current_setting('request.jwt.claims')::json->>'userId')::UUID OR
        vendor_id = (current_setting('request.jwt.claims')::json->>'userId')::UUID
    )
  );

-- Create functions for update messages
CREATE OR REPLACE FUNCTION update_message_read_status()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updating chat timestamps
CREATE TRIGGER set_chat_updated_at
BEFORE UPDATE ON chats
FOR EACH ROW
EXECUTE FUNCTION update_message_read_status();