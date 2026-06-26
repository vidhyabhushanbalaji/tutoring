import { useState } from 'react'
import { BrowserRouter, Routes, Route, useNavigate} from 'react-router-dom'
import './App.css'
import Login from './Login';
import Setup from './Setup';
import axios from 'axios'

function App() {
  const [count, setCount] = useState(0)
  
  const [email, setEmail] = useState('')
  const [pwd, setPwd] = useState('')

  const [setup, setSetup] = useState(false)

  function maybeDetails(){
    if (setup){
      return <Setup />
    }
    else{
      return (<p>Nothing</p>)
    }
  }


  function handleSubmit(event){
    event.preventDefault();
    axios.post("http://localhost:3000/users/login",
      {email: email, password: pwd})
    .then(res=> 
      {if (res.status === 200){
        if (res.data == "Account setup needed"){
            console.log("Account setup needed")
            setSetup = (()=> true)
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

          {maybeDetails()}
        
        </div>
        
      </section>
    </>
  )
}

/**
  function App() {
  const nav = useNavigate()
  nav('/login')

  return (
    <BrowserRouter>
    <Routes>
      <Route exact path="/login" element={<Login/>}/>
      <Route exact path="/setup" element={<Blog/>}/>
    </Routes>
    </BrowserRouter>
    
  )
}
 */


export default App;