import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import './App.css'
import axios from 'axios'
import { supabase } from './supabaseClient';

function Setup(){

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
        axios.post("localhost:443/users/usersetup", {
          UUID: data.id,
          isTutor: (status==="T"),
          first_name: fn, 
          last_name: ln
        })
      }   
  }
    return (
    <>
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