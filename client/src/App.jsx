import { useState } from 'react'
import { BrowserRouter, Routes, Route, useNavigate} from 'react-router-dom'
import './App.css'
import Login from './Login';
import Setup from './Setup';
import axios from 'axios'

function App() {

  /*
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
  */

  return (
    <>

      <BrowserRouter>
        <Routes>
          
          <Route exact path="/login" element={<Login/>}/>
          <Route exact path="/setup" element={<Setup/>}/>
          <Route exact path="/" element={<Login/>}/>
        </Routes>
      </BrowserRouter>

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