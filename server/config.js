require('dotenv').config()
module.exports={
    PRIVATE_KEY: process.env.PRIVATE_KEY,
    CERTIFICATE: process.env.CERTIFICATE,
    SUPABASE_URL: process.env.SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY: process.env.SUPABASE_PUBLISHABLE_KEY,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
}