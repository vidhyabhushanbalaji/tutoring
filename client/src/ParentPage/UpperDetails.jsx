import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom';
import Modal from '../Modal'
import axios from 'axios'
import { X } from 'lucide-react';
import { supabase } from '../lib/supabase/client';



function UpperDetails({ title, details, setPriceChange}){
    const nav = useNavigate()  
    const [desc, setDesc] = useState("")
    const [price, setPrice] = useState("")
    const [publicNote, setPublicNote] =useState("")
    const [deleteOpen, setDeleteOpen] = useState(false)

    const [tutorFirstName, setTutorFirstName] =useState("") 
    const [tutorLastName, setTutorLastName] =useState("") 
    const [tutorEmail, setTutorEmail] =useState("") 

    const formatter = new Intl.NumberFormat('default', {style: 'currency', currency: 'GBP'});

    useEffect(()=> {
                console.log("recieved details")
                console.log(details)
                setDesc(details.description);
                setPrice(details.default_price)
                setPublicNote(details.public_note);
                var tutor = {...details.tutor}
                if(Object.keys(tutor).length!= 0){
                    setTutorFirstName(details.tutor.first_name)
                    setTutorLastName(details.tutor.last_name)
                    setTutorEmail(details.tutor.email)}
    }, [details])

    async function removeParent(){
        axios.post(`/api/users/removeparent`,
            {
                is_tutor: false,
                clientlink: details.clientlink
            })
        .then(res=>{
            nav('/home')
    })}


    function Content(){
        return(
            <>
            <div className="pr-5 h-full w-full flex flex-row">
                <div className="pr-10 flex flex-col text-left h-full max-w-1/2 min-w-fit ">
                    <p className='text-white text-6xl font-semibold'>{desc}</p>
                    <div className="flex flex-row">
                            <h2 className="w-full text-white text-left">
                                Default Price: {formatter.format(price)}
                            </h2>
                    </div>
                    <h2 className='text-white text-left'>Tutoring since : {new Date(details.start).toUTCString().slice(0,-13)}</h2> 
                    
                </div>
                <div className="w-full flex flex-col text-left h-full pr-5">
                    <p
                        id="client-publicnotes" 
                        className="h-1/2 w-full text-white"
                    >
                        <b>Notes: </b>{publicNote}
                    </p>

                    
                </div>
                <div className='min-w-52 pr-4 text-left mt-1'>
                <h2 className='text-white'>Tutor:</h2>
                <h3 className='text-gray-100'>{tutorFirstName}</h3>
                <h3 className='text-gray-100'>{tutorLastName}</h3>
                <a href={`mailto:`}>
                    <h3 className='text-gray-100 hover:text-gray-300 '>
                        {tutorEmail}
                    </h3>
                </a>
                
                </div>
                    

                <button className="h-4/5 w-10 bg-gray-300 my-2" onClick={()=>
                        {setDeleteOpen(true);
                }}>
                    <X />
                </button>

            </div>
            </>
            )
    }


    return(
        <>
            {Content()}
            <Modal open={deleteOpen} onClose={()=>{setDeleteOpen(false)}}>
                <h2>Sure you want to exit this student's records?</h2>
                You will have to ask to be readded by the tutor.<br/>
                You will lose access to all lesson records.<br/> 
                <br/><br/>
                <button className="bg-red-600 text-black mb-2" onClick={()=>removeParent()}>I am certain I want to exit this student record</button>
                <br/>
            </Modal>
        </>
    )
}
export default UpperDetails;