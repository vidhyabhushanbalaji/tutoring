
import { useState, useEffect, use } from 'react'
import { Link, useNavigate } from "react-router-dom"
import { supabase } from './supabaseClient';
import { Loader } from 'lucide-react';
import TutorPayments from './TutorPage/payments';
import axios from 'axios'
import ParentHome from './ParentPage/home';
import Modal from './Modal'



function Payments() {
    useEffect(()=>{
        getThisMonth()
    },[])

    const [isTutor, setTutor] = useState(false)
    const [loadingOpen, setLoadingOpen] = useState(true)

    const [data, setData] = useState({
        clients:[],
        thisMonth:[]})

    async function getThisMonth(){
        try{
        const session = await supabase.auth.getSession()
        await axios.post(
            "https://helpmetutor-backend.vercel.app:443/payments",
            {headers:
                {Authorization: `Bearer: ${session.data.session.access_token}`}, 
                user: session.data.session.user.id}).
        then((res) =>{
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
                <div className="p-2 w-72 space-y-3">
                    <h1>Loading</h1>
                    <Loader className="animate-bounce" size={300}/>
                </div>
            </Modal>
            {isTutor ? <TutorPayments data={data} /> : <p>Nothing</p>}
            
        </>
    )

}
export default Payments;