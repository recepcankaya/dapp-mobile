import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://gittjeqpqcmmbterylkd.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdpdHRqZXFwcWNtbWJ0ZXJ5bGtkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcwOTIwNDM2NCwiZXhwIjoyMDI0NzgwMzY0fQ.Y5Zp48dzrtSWzatGtTptbYP-fbvhwqTfQHjmBVNRTSg"
);

export default supabase;
