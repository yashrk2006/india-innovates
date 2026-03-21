import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import path from 'path'

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testConnection() {
  console.log('Testing Supabase connection...')
  const { data, error } = await supabase.from('profiles').select('count', { count: 'exact', head: true })
  
  if (error) {
    console.error('Connection failed:', error.message)
    process.exit(1)
  }
  
  console.log('Connection successful! Profiles found:', data)
  process.exit(0)
}

testConnection()
