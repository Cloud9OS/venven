/*
  # Update Schema for Local Services Marketplace App

  1. Changes
    - Add policy existence checks before creation
    - Ensure idempotent policy creation
    - Maintain existing table structure and security

  2. Security
    - Maintain RLS on all tables
    - Update policies with proper auth checks
*/

-- Enable UUID generation
DO $$ BEGIN
  CREATE EXTENSION IF NOT EXISTS "pgcrypto";
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- Drop existing policies if they exist
DO $$ BEGIN
  DROP POLICY IF EXISTS "Users can read own data" ON users;
  DROP POLICY IF EXISTS "Admin can manage all users" ON users;
  DROP POLICY IF EXISTS "Users can read their own chats" ON chats;
  DROP POLICY IF EXISTS "Users can create their own chats" ON chats;
  DROP POLICY IF EXISTS "Users can read messages in their chats" ON messages;
  DROP POLICY IF EXISTS "Users can insert messages in their chats" ON messages;
EXCEPTION
  WHEN undefined_object THEN NULL;
END $$;

-- Create new policies
CREATE POLICY "Users can read own data" ON users
  FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Admin can manage all users" ON users
  FOR ALL
  USING (current_setting('request.jwt.claims')::json->>'userType' = 'admin');

CREATE POLICY "Users can read their own chats" ON chats
  FOR SELECT
  USING (
    customer_id = auth.uid() OR
    vendor_id = auth.uid()
  );

CREATE POLICY "Users can create their own chats" ON chats
  FOR INSERT
  WITH CHECK (
    customer_id = auth.uid() OR
    vendor_id = auth.uid()
  );

CREATE POLICY "Users can read messages in their chats" ON messages
  FOR SELECT
  USING (
    chat_id IN (
      SELECT id FROM chats WHERE
        customer_id = auth.uid() OR
        vendor_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert messages in their chats" ON messages
  FOR INSERT
  WITH CHECK (
    sender_id = auth.uid() AND
    chat_id IN (
      SELECT id FROM chats WHERE
        customer_id = auth.uid() OR
        vendor_id = auth.uid()
    )
  );

-- Ensure admin user exists
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