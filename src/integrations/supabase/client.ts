import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://ktkgkdjxfocgkzakezwz.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt0a2drZGp4Zm9jZ2t6YWtlend6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM2MTYwNzMsImV4cCI6MjA5OTE5MjA3M30.V3UvKtrJUp40cS8-4ELtkRLGgM3XxZfzx3qbhhRu1ls";

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);