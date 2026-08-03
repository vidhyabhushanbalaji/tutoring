import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom';
import Modal from '../Modal'
import axios from 'axios'
import { SquareArrowRightExit } from 'lucide-react';


function UpperDetails({ title, details, setPriceChange}){
    let detailsSet = false;
    const nav = useNavigate()  
    const userID = localStorage.getItem("id")
    const [desc, setDesc] = useState("")
    const [price, setPrice] = useState("")
    const [publicNote, setPublicNote] =useState("")
    const [deleteOpen, setDeleteOpen] = useState(false)

    const [tutorFirstName, setTutorFirstName] =useState("") 
    const [tutorLastName, setTutorLastName] =useState("") 
    const [tutorEmail, setTutorEmail] =useState("") 


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

    function removeParent(){
        axios.post("http://localhost:3000/users/removeparent",
            {
                "clientlink": details.clientlink,
                "parent_id": userID,
            })
        .then(res=>{
            nav('/home')
    })}


    function Content(){
        return(
            <>
            <div class="pr-5 h-full w-full flex flex-row">
                <div class="pr-10 flex flex-col text-left h-full max-w-1/2 min-w-fit ">
                    <h1>{desc}</h1>
                    <div class="flex flex-row">
                            <h2 class="w-full">
                                Default Price: {price}
                            </h2>
                    </div>
                    <h2>Tutoring since : {new Date(details.start).toUTCString().slice(0,-13)}</h2> 
                    
                </div>
                <div class="w-full flex flex-col text-left h-full pr-5">
                    <p
                        id="client-publicnotes" 
                        class="h-1/2 w-full"
                    >
                        <b>Notes: </b>{publicNote}
                    </p>

                    
                </div>
                <div className='min-w-52 pr-4 text-left mt-1'>
                <h2>Tutor:</h2>
                <h3>{tutorFirstName}</h3>
                <h3>{tutorLastName}</h3>
                <a href={`mailto:`}>
                    <h3 className='hover:text-blue-500 '>
                        {tutorEmail}
                    </h3>
                </a>
                
                </div>
                    

                <button class="h-full w-10 bg-red-500" onClick={()=>
                        {setDeleteOpen(true);
                }}>
                    <SquareArrowRightExit />
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
                <button class="bg-red-600 text-black mb-2" onClick={()=>removeParent()}>I am certain I want to exit this student record</button>
                <br/>
            </Modal>
        </>
    )
}
export default UpperDetails;