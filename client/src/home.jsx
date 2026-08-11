
import { useState, useEffect, use } from 'react'
import { Link, useNavigate } from "react-router-dom"
import { supabase } from './supabaseClient';
import { Loader } from 'lucide-react';
import TutorHome from './TutorPage/home';
import axios from 'axios'
import ParentHome from './ParentPage/home';
import Modal from './Modal'



function Home() {
    useEffect(()=>{
        getDetails()
    },[])

    const [isTutor, setTutor] = useState(false)
    const [loadingOpen, setLoadingOpen] = useState(true)

    const [data, setData] = useState({
        tutors:[], 
        unpaid:[], 
        first_name:'', 
        last_name:'',
        email: '', 
        authcode:'',
        parent:{
            first_name: '',
            last_name: '',
            email:''
        }})

    async function getDetails(){
        try{
        console.log("here1")
        const session = await supabase.auth.getSession()
        console.log("here2")
        await axios.post("https://helpmetutor-backend.vercel.app:443/homepage",
            {headers:
                {Authorization: `Bearer: ${session.data.session.access_token}`}, 
            user: session.data.session.user.id}).
        then(res =>{
            
            if (res.data.is_tutor){
                setTutor(true)
            }
            setData({})
            setData(res.data)
            setLoadingOpen(false)
        })}
    catch{
        return(<p>error</p>)
    }
    }
    
    


    return (
        <>  
        
            <Modal open={loadingOpen} onClose={()=>{setLoadingOpen(false)}}>
                <h1>Loading</h1>
                <Loader className="animate-bounce" size={300}/>
            </Modal>
            {isTutor ? <TutorHome data={data} /> : <ParentHome data={data}/>}
            
        </>
    )

}
export default Home;