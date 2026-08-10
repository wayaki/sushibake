import {
  createClient
} from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

const SUPABASE_URL =
  "https://ljrunwghvvdmslrxpwbb.supabase.co";

const SUPABASE_ANON_KEY =
  "sb_publishable_329WxPfJv1DPEjC2SiR5Bg_GCP3UuYH";

export const supabase =
  createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
  );