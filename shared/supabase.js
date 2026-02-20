// CONFIG
import { createClient } from "@supabase/supabase-js";

const API_URL = 'https://wnoghxzxbwnvqbujimwh.supabase.co'
const API_TOKEN = 'sb_publishable_lhSV1V_m-5eyLKtf6zeZzw_y_ME9rMc'

export const supabaseClient = createClient(API_URL, API_TOKEN);