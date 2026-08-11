import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Check } from 'lucide-react';
import AuthLayout from './AuthLayout';
import './App.css'
import axios from 'axios'
import { supabase } from './supabaseClient';

function Setup(){

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [role, setRole] = useState('student'); // 'student' | 'tutor'
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const passwordsMatch = password.length > 0 && password === confirmPassword;
  const passwordsMismatch = confirmPassword.length > 0 && password !== confirmPassword;

  const canSubmit =
    firstName.trim() && lastName.trim() && email.trim() && passwordsMatch;

    const nav = useNavigate()  
    const [fn, setfn] = useState('')
    const [ln, setln] = useState('')
    const [email, setEmail] = useState('')
    const [pwd1, setPwd1] = useState('')
    const [pwd2, setPwd2] = useState('')
    const [status, setStatus] = useState('')

    async function handleSubmit(event){
        if (pwd1!=pwd2){
            setPwd1("")
            setPwd2("")
            alert("passwords don't match, retry those")
            return;
        }
      event.preventDefault();
      const { data, error } = await supabase.auth.signUp({
          email: email,
          password: pwd1,
      })
      if(!error){
        console.log(data)
        const session = await supabase.auth.getSession()
        axios.post("https://helpmetutor-backend.vercel.app:443/users/usersetup", {
          headers:{Authorization: `Bearer: ${session.data.session.access_token}`},
          user: data.user.id,
          userData:{
            isTutor: (status==="T"),
            first_name: fn, 
            last_name: ln,
            email: email}
        })
      }   
  }
    return (
    <>

      <AuthLayout
      title="Keep every lesson organized."
      subtitle="Track students, schedules, and payments in one place — built for tutors who'd rather teach than manage spreadsheets."
      >
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-900">Create your account</h2>
        <p className="text-sm text-gray-500 mt-1">
          Already have one?{' '}
          <a href="/login" className="text-blue-600 hover:text-blue-700 font-medium">
            Log in
          </a>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">First name</label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Jane"
              required
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Last name</label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Doe"
              required
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
            />
          </div>
        </div>

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

        {/* Role toggle */}
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">I am a</label>
          <div className="grid grid-cols-2 gap-2 bg-gray-100 rounded-lg p-1">
            <button
              type="button"
              onClick={() => setRole('student')}
              className={`py-1.5 rounded-md text-sm font-medium transition-colors ${
                role === 'student'
                  ? 'bg-white text-blue-700 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Student
            </button>
            <button
              type="button"
              onClick={() => setRole('tutor')}
              className={`py-1.5 rounded-md text-sm font-medium transition-colors ${
                role === 'tutor'
                  ? 'bg-white text-blue-700 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Tutor
            </button>
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Password</label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 8 characters"
              required
              minLength={8}
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

        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Confirm password</label>
          <div className="relative">
            <input
              type={showConfirm ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter your password"
              required
              className={`w-full rounded-lg border pl-3 pr-10 py-2 text-sm focus:outline-none focus:ring-2 focus:border-transparent ${
                passwordsMismatch
                  ? 'border-red-300 focus:ring-red-300'
                  : 'border-gray-300 focus:ring-blue-400'
              }`}
            />
            <button
              type="button"
              onClick={() => setShowConfirm((s) => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              tabIndex={-1}
            >
              {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {passwordsMismatch && (
            <p className="text-xs text-red-500 mt-1">Passwords don't match</p>
          )}
          {passwordsMatch && (
            <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
              <Check size={12} /> Passwords match
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={!canSubmit}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white text-sm font-medium py-2.5 rounded-lg shadow-sm transition-colors mt-2"
        >
          Create account
        </button>
      </form>
    </AuthLayout>

      <section id="top">
        <div>  
          <h1>Setup your details below</h1>
        </div>
        
      </section>

      <section id="details">
        <div id="details">

          <form onSubmit={handleSubmit}>
            <input name ="fn"
            placeholder = "first name"
            value = {fn}
            onChange = {e => setfn(e.target.value)}></input> 
            <br></br>

            <input name ="ln"
            placeholder = "last name"
            value = {ln}
            onChange = {e => setln(e.target.value)}></input> 
            <br></br>

            <input name ="status"
            placeholder = "status letter"
            maxLength="1"
            value = {status}
            onChange = {e => setStatus(e.target.value)}></input> 
            <br></br>

            <br></br>

            <input name ="email"
            placeholder = "email"
            value = {email}
            onChange = {e => setEmail(e.target.value)}></input> 
            <br></br>
            <input name ="pwd1" 
                    value = {pwd1}
                    type="password"
                    placeholder = "choose a secure password"
                    onChange = {e => setPwd1(e.target.value)}
            ></input>
            <br></br>
            <input name ="pwd2" 
                    value = {pwd2}
                    placeholder = "confirm password"
                    type="password"
                    onChange = {e => setPwd2(e.target.value)}
            ></input>
            <br></br>
            <button>Let's go!</button>
          </form>
        </div>
      </section>
    </>
  )
}

export default Setup;