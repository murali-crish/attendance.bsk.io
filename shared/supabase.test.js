import { supabaseClient } from "./supabase";

test("supabase is defined", async () => {
    expect(supabaseClient).toBeDefined();
})