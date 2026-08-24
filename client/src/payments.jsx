
import { useState, useEffect, use } from 'react'
import { Link, useNavigate } from "react-router-dom"
import { supabase } from './lib/supabase/client';
import { Loader } from 'lucide-react';
import TutorPayments from './TutorPage/payments';
import axios from 'axios'
import ParentPayments from './ParentPage/payments';
import Modal from './Modal'



function Payments() {
    useEffect(()=>{
        getThisMonth()
    },[])

    const [isTutor, setTutor] = useState(false)
    const [loadingOpen, setLoadingOpen] = useState(true)

    const [data, setData] = useState({
        clients:[],
        tutors:[],
        thisMonth:[]})

    async function getThisMonth(){
        try{
        await axios.post(
            `/api/payments`,
            {}).
        then((res) =>{
            if (res.data.is_tutor){
                setTutor(true)
                setData({...res.data, tutors:[]})
            }
            else{
                setData(res.data)
            }
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
            {isTutor ? <TutorPayments data={data} /> : <ParentPayments data={data}/>}
            
        </>
    )

}
export default Payments;