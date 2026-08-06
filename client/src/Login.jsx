import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';

import './App.css'
import axios from 'axios'

function Login() {
  const nav = useNavigate()  
  const [email, setEmail] = useState('')
  const [pwd, setPwd] = useState('')
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