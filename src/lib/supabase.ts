import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://chnavazwzzgtlvpsnpgu.supabase.co'; 
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNobmF2YXp3enpndGx2cHNucGd1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM4NjgxOTEsImV4cCI6MjA1OTQ0NDE5MX0.8LDeSTw9QcEHuez1fG9JagEGu8xUSP4WqB3QmPLa2bM';

export const supabase = createClient(supabaseUrl, supabaseKey);
