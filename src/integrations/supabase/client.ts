// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://owngvqpagvmymqorfzor.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im93bmd2cXBhZ3ZteW1xb3Jmem9yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAzMTM3NDEsImV4cCI6MjA2NTg4OTc0MX0.8gkI9KCMs28rZLVsv7BQiUGEoBUVDYdqig-NBYd8yJc";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);