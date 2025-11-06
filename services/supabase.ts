import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://edyvpyrcozavrpivciwd.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVkeXZweXJjb3phdnJwaXZjaXdkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ5NzI2MTEsImV4cCI6MjA2MDU0ODYxMX0.-S01-GP1qBe-RmeJwYtN9kZnFVe3VgfQDuzD88Pmd-c';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
