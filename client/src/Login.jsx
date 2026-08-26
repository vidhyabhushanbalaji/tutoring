import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Loader } from 'lucide-react';
import AuthLayout from './AuthLayout';
import Modal from './Modal'
import { supabase } from './lib/supabase/client';



import './App.css'
import axios from 'axios'

function Login() {
  const nav = useNavigate()  
  const [email, setEmail] = useState('')
  const [pwd, setPwd] = useState('')
  const [showPassword, setShowPassword] = useState(false);
  const [cookieConsent, setCookieConsent] = useState(true);
  
  useEffect(()=>{
    axios.post(`/api/users/checksession`,{})
        .then(res=>{ 
          if (res.data.valid){
              nav('/home')}})
  }, [])

  async function handleSubmit(event){
    event.preventDefault();
    await axios.post(`api/users/login`,{
      email: email,
      password: pwd,
    }).then(()=>{nav('/home')})
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
      {cookieConsent ?
        <div className="fixed bottom-4 left-4 right-4 left-auto right-4 max-w-md bg-white rounded-xl border border-gray-400 p-4 flex flex-row items-center gap-3">
            <p className="text-sm text-black flex-1">
              Cookies are used to keep you logged in. These are not shared, or used for any third party purposes.
            </p>
            <div className="flex gap-2 shrink-0">
              <button
                onClick={() => setCookieConsent(false)}
                className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-1.5 rounded-lg shadow-sm"
              >
                Accept
              </button>
            </div>
        </div> : <div/>}
      
    </AuthLayout>
      
      
    </>
  )
}

export default Login;