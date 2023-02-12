import { NextApiRequest, NextApiResponse } from 'next'
import { createClient } from '@supabase/supabase-js'
import { Database } from './src/supabaseTypes'

const supabase = createClient<Database>(
  "https://mwaczrflndhiavehyhpm.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im13YWN6cmZsbmRoaWF2ZWh5aHBtIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzYxNTI3MTgsImV4cCI6MTk5MTcyODcxOH0.5iV_MMEt-9_2oRiBHbu0304zLaHzpxG6LVjTJKn2ysg"
)

const main = async () => {
  const allOnlineUsers = await supabase.from('users').select('*');
  console.log(allOnlineUsers);
}

main()
