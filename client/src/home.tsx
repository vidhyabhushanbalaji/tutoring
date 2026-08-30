
import { useState, useEffect, use } from 'react'
import { Link, useNavigate } from "react-router-dom"
import { supabase } from './lib/supabase/client';
import { Loader } from 'lucide-react';
import TutorHome from './TutorPage/home';
import axios from 'axios'
import ParentHome from './ParentPage/home';
import Modal from './Modal'

import { parentHomeType } from './types/parentHomeType'



function Home() {
    useEffect(()=>{
        getDetails()
    },[])

    const [isTutor, setTutor] = useState(false)
    const [loadingOpen, setLoadingOpen] = useState(true)

    const [data, setData]= useState<parentHomeType>({
        tutors: [], 
        unpaid:[],
        next3: [],
        first_name:'', 
        last_name:'',
        email: '', 
        authcode:'',
        parent:{
            first_name: '',
            last_name: '',
            email:''
        },
        tutor:{
            first_name: '',
            last_name: '',
            email:''
        }})

    async function getDetails(){
        try{
        const session = await supabase().auth.getSession()
        await axios.post(
            `/api/homepage`, {
                withCredentials: true,
                }).
        then(res =>{
            if (res.data.is_tutor){
                setTutor(true)
            }
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
            
            
            {isTutor ? 
                    <TutorHome data={data} /> : 
                    <ParentHome data={data}/>

            }
           
            
            
        </>
    )

}
export default Home;