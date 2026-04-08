/*
  # Quick Notes Database Schema

  1. New Tables
    - `notes`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `title` (text)
      - `content` (text)
      - `is_private` (boolean, default false)
      - `reminder_email` (boolean, default false)
      - `reminder_whatsapp` (boolean, default false)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `note_history`
      - `id` (uuid, primary key)
      - `note_id` (uuid, references notes)
      - `title` (text)
      - `content` (text)
      - `edited_at` (timestamptz)
  
  2. Security
    - Enable RLS on all tables
    - Users can only access their own notes
    - Users can only view history for their own notes
*/

CREATE TABLE IF NOT EXISTS notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL DEFAULT '',
  content text NOT NULL DEFAULT '',
  is_private boolean DEFAULT false,
  reminder_email boolean DEFAULT false,
  reminder_whatsapp boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS note_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  note_id uuid REFERENCES notes(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  content text NOT NULL,
  edited_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE note_history ENABLE ROW LEVEL SECURITY;

-- RLS Policies for notes table
CREATE POLICY "Users can view own notes"
  ON notes FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own notes"
  ON notes FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own notes"
  ON notes FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own notes"
  ON notes FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for note_history table
CREATE POLICY "Users can view own note history"
  ON note_history FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM notes
      WHERE notes.id = note_history.note_id
      AND notes.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own note history"
  ON note_history FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM notes
      WHERE notes.id = note_history.note_id
      AND notes.user_id = auth.uid()
    )
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_notes_user_id ON notes(user_id);
CREATE INDEX IF NOT EXISTS idx_notes_created_at ON notes(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_note_history_note_id ON note_history(note_id);
CREATE INDEX IF NOT EXISTS idx_note_history_edited_at ON note_history(edited_at DESC);