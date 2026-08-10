import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dotenv from 'dotenv'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  //define:{
  //  'process.env.VITE_SUPABASE_URL': JSON.stringify(processLock.env.VITE_SUPABASE_URL),
  //  'process.env.VITE_SUPABASE_PUBLISHABLE_KEY': JSON.stringify(processLock.env.VITE_SUPABASE_PUBLISHABLE_KEY)
  //}
})
