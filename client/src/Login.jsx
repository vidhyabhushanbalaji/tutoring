import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import './App.css'
import axios from 'axios'

function Login() {
  const nav = useNavigate()
  const [count, setCount] = useState(0)
  
  const [email, setEmail] = useState('')
  const [pwd, setPwd] = useState('')

  
  function handleSubmit(event){
    event.preventDefault();
    axios.post("http://localhost:3000/users/login",
      {email: email, password: pwd})
    .then(res=> 
      {if (res.status === 200){
        if (res.data == "Account setup needed"){
            nav('/setup')
        }
      }
    }).catch(err =>
      {
        console.log("unsuccesful login attempt")
        setPwd("")
        setEmail("")
      }
    );
  }

  return (
    <>
      <section id="top">
        <div>  
          <h1>Welcome</h1>
          <p>
            Login below
          </p>
        </div>

        <button
          type="button"
          className="counter"
          onClick={() => setCount((count) => count + 1)}
        >
          Count is {count}
        </button>
        
      </section>

      <section id="next-steps">
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
        </div>
        
      </section>
    </>
  )
}

export default Login;