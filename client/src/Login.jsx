import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import AuthLayout from './AuthLayout';
import { supabase } from './supabaseClient';



import './App.css'
import axios from 'axios'

function Login() {
  const nav = useNavigate()  
  const [email, setEmail] = useState('')
  const [pwd, setPwd] = useState('')
  const [showPassword, setShowPassword] = useState(false);

  
  async function handleSubmit(event){
    event.preventDefault();
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: pwd,
    })
    if (!error){
      nav('/home')
    }
  }

  function setupAccount(){
        console.log("cliicked")
        nav('/setup')
    }

  

  return (
    <>
      <AuthLayout 
      title="Welcome back."
      subtitle="No more spreadsheets. One simple solution. HelpMeTutor.">

      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-900">Log in</h2>
        <p className="text-sm text-gray-500 mt-1">
          New here?{' '}
          <a href="/setup" className="text-blue-600 hover:text-blue-700 font-medium">
            Create an account
          </a>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="jane@example.com"
            required
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="block text-xs font-medium text-gray-600">Password</label>
            <a href="/forgot-password" className="text-xs text-blue-600 hover:text-blue-700">
              Forgot password?
            </a>
          </div>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={pwd}
              onChange={(e) => setPwd(e.target.value)}
              placeholder="Your password"
              required
              className="w-full rounded-lg border border-gray-300 pl-3 pr-10 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2.5 rounded-lg shadow-sm transition-colors mt-2"
        >
          Log in
        </button>
      </form>
    </AuthLayout>

      
    </>
  )
}

export default Login;