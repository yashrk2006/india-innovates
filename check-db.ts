import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl!, supabaseAnonKey!)

async function checkDb() {
  console.log('Checking Booths...')
  const { data: booths, error: bError } = await supabase.from('booths').select('id, name').limit(5)
  console.log('Booths:', booths || bError)

  console.log('Checking Voters...')
  const { data: voters, error: vError } = await supabase.from('voters').select('id').limit(5)
  console.log('Voters:', voters || vError)
}

checkDb()
