import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://sea-lion-app-s86sj.ondigitalocean.app/';
const supabaseKey = process.env.supabaseKey
const supabase = createClient(supabaseUrl, supabaseKey)

export default supabase;