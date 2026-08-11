import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { Eye, EyeOff } from 'lucide-react';
import AuthLayout from './AuthLayout';


import './App.css'
import axios from 'axios'

function Login() {
  const nav = useNavigate()  
  const [email, setEmail] = useState('')
  const [pwd, setPwd] = useState('')
  const [showPassword, setShowPassword] = useState(false);
  const [cookies, setCookies, removeCookie] = useCookies(["userID"])

  
  function handleSubmit(event){
    event.preventDefault();
    axios.post("https://localhost:443/users/login",
      {email: email, password: pwd})
    .then(res=> {
        localStorage.setItem("id", res.data.id)
        setCookies("userID", res.data.id, { path: "/" })
        if (res.data.status=="T"){
          nav('/tutor/home')
        }
        else{
          nav('/parent/home')
        }
        }
    ).catch(err =>
      {
        console.log("unsuccesful login attempt")
        setPwd("")
        setEmail("")
      }
    )}

    function setupAccount(){
        console.log("cliicked")
        nav('/setup')
    }

  

  return (
    <>
      <AuthLayout
      title="Welcome back."
      subtitle="Pick up right where you left off — your students, schedule, and notes are all waiting."
    >
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-900">Log in</h2>
        <p className="text-sm text-gray-500 mt-1">
          New here?{' '}
          <a href="/signup" className="text-blue-600 hover:text-blue-700 font-medium">
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
              onClick={() => setShowPassword((s) => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              tabIndex={-1}
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



      <div className='w-screen h-screen flex flex-row'>

        <div className='w-1/2 h-full bg-blue-200'>
        
        </div>

        <div className='w-1/2 h-full bg-blue-300'>
          
          <div id="top">
        <div>  
          <h1>Welcome</h1>
          <p>
            Login below
          </p>
        </div>
        
      </div>

      <div id="login">
        <div id="login">
          <form onSubmit={handleSubmit}>
            <input name ="email"
            value = {email}
            onChange = {e => setEmail(e.target.value)}></input> 
            <br></br>
            <input name ="pwd" 
                    value = {pwd}
                    type="password"
                    onChange = {e => setPwd(e.target.value)}
            ></input>
            
            <br></br>


            <button>Login</button>
          </form>
          <button onClick={setupAccount}>setup</button>
        </div>
        
      </div>

        </div>

      </div>

      
    </>
  )
}

export default Login;