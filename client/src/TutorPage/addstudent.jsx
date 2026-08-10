import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios'
import { supabase } from '../supabaseClient';



function AddStudent(){
    const nav = useNavigate()  
    const [desc, setDesc] = useState('')
    const [price, setPrice] = useState(0.00)


    async function handleSubmit(event){
        event.preventDefault();
        const session = await supabase.auth.getSession()
        axios.post("https://helpmetutor-backend.vercel.app:443/users/addclient/",
            {headers:
                {Authorization: `Bearer: ${session.data.session.access_token}`}, 
            user: session.data.session.user.id,
            newStudent:
                {description: desc, 
                default_price: price}})
        .then(res=> {
            console.log(res)
            const clientstudentID = res.data.clientlink
            console.log("got id of"+clientstudentID)
            const navlocation = '/student/'+clientstudentID
            console.log(navlocation)
            nav(navlocation)}
        ).catch(err =>
        {
            console.log("unsuccesful add attempt")
            setDesc("")
            setPrice(0)
        }
    )}

    return(
        <form onSubmit={handleSubmit}>
            <div className='flex flex-col'>
            <h2 className='text-gray-500 text-4xl mb-4'>Add a new tutoring student</h2>
            <input name ="description"
                placeholder = "Description for your new tutoring client"
                value = {desc}
                onChange = {e => setDesc(e.target.value)}
                className='w-full'/>
            <p className='text-xs mb-4'>Note: you can link a parent to this student in the next page</p>    
            
            <div>
                Default Lesson price: £<input name = "price" 
                        placeholder = "Default price for a lesson"
                        value = {price}
                        onChange = {e => {if (!isNaN(e.target.value)){setPrice(e.target.value)}}}
                />
            </div>

            <br/>            


            <button className='my-4 hover:bg-blue-300'>Add new tutoring role</button>
            </div>
          </form>
    )
}
export default AddStudent;

