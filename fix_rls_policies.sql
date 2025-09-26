-- Fix RLS policies for conversations and messages tables
-- Run this in the Supabase SQL Editor

-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Users can view conversations they're part of" ON public.conversations;
DROP POLICY IF EXISTS "Users can create conversations they're part of" ON public.conversations;
DROP POLICY IF EXISTS "Users can view messages in their conversations" ON public.messages;
DROP POLICY IF EXISTS "Users can send messages in their conversations" ON public.messages;
DROP POLICY IF EXISTS "Users can update their own messages" ON public.messages;

-- Create permissive policies for development
CREATE POLICY "Allow all to view conversations" ON public.conversations FOR SELECT USING (true);
CREATE POLICY "Allow all to create conversations" ON public.conversations FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow all to update conversations" ON public.conversations FOR UPDATE USING (true);
CREATE POLICY "Allow all to delete conversations" ON public.conversations FOR DELETE USING (true);

CREATE POLICY "Allow all to view messages" ON public.messages FOR SELECT USING (true);
CREATE POLICY "Allow all to send messages" ON public.messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow all to update messages" ON public.messages FOR UPDATE USING (true);
CREATE POLICY "Allow all to delete messages" ON public.messages FOR DELETE USING (true);