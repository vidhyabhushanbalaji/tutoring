import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom';
import Modal from './Modal'
import axios from 'axios'


function UpperDetails({ title, details, setPriceChange}){
    let detailsSet = false;
    const nav = useNavigate()  
    const userID = localStorage.getItem("id")
    const [editsOpen, setEditsOpen] = useState(false)

    const [desc, setDesc] = useState("")
    const [price, setPrice] = useState("")
    const [publicNote, setPublicNote] =useState("")
    const [privateNote, setPrivateNote] =useState("")
    const [deleteOpen, setDeleteOpen] = useState(false)

    const newChanges = useRef({});

    useEffect(()=> {
                console.log("recieved details")
                console.log(details)
                setDesc(details.description);
                setPrice(details.default_price)
                setPublicNote(details.public_note);
                setPrivateNote(details.private_note);
    }, [details])


    function updateClient(){
        console.log("update");
        console.log(newChanges)
        axios.post("http://localhost:3000/updateclient",
            {"tutor_id": userID,
            "clientlink": details.clientlink,
            "changes": newChanges.current}).then(res=>{console.log("here")
        if("default_price" in newChanges.current){
            setPriceChange("£"+newChanges.current.default_price);
        }
        newChanges.current= {};
    })}

    function deleteClient(){
        axios.post("http://localhost:3000/deleteclient",
            {"tutor_id": userID,
            "clientlink": details.clientlink})
        .then(res=>{
            nav('/home')
    })}


    function Content(){
        if(editsOpen){
            return(
            <>
            <div class="pr-5 h-full w-full flex flex-row">
                <div class="pr-5 flex flex-col text-left h-full max-w-1/2 min-w-fit ">
                    <input name ="description"
                        placeholder = "Title"
                        value = {desc}
                        onChange = {e => {
                            setDesc(e.target.value)
                            newChanges.current["description"]=e.target.value}}
                        style={{"fontSize":"32px"}}/>


                    <div class="flex flex-row">
                            <h2 class="w-full">
                                Default Price:£
                                <input name = "price" 
                                    placeholder = "Default price"
                                    value = {price}
                                    onChange = {
                                        e => {if (!isNaN(e.target.value)){
                                            setPrice(e.target.value)}
                                            newChanges.current["default_price"]=e.target.value}}
                                    />
                            </h2>
                    </div>
                    <h2>Tutoring since : {new Date(details.start).toUTCString().slice(0,-13)}</h2> 
                    
                </div>
                <div class="w-full flex flex-col text-left h-full pr-5">
                    <textarea
                        id="client-publicnotes" 
                        placeholder='public note' 
                        class="h-1/2 w-full"
                        maxLength="256"
                        value = {publicNote}
                        onChange = {e => {
                        setPublicNote(e.target.value);
                        newChanges.current["publicNote"]=e.target.value;
                    }}
                    />

                    <textarea 
                        id="client-privatenotes" 
                        placeholder='private note' 
                        class="h-1/2 w-full"
                        maxLength="256"
                        value = {privateNote}
                        onChange = {e => {
                        setPrivateNote(e.target.value);
                        newChanges.current["privateNote"]=e.target.value;
                    }}
                    />
                </div>
                <button class="h-full w-10 bg-green-300" onClick={()=>
                    {   setEditsOpen(false);
                        updateClient();
                        setPrice("£"+price);
                    }}>
                    S<br/>A<br/>V<br/>E
                </button>
                <button class="h-full w-10 bg-red-600" onClick={()=>setDeleteOpen(true)}>
                    D<br/>E<br/>L<br/>E<br/>T<br/>E
                </button>

            </div>
            </>
        )
        }
        else{
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
                        <b>Public Notes: </b>{publicNote}
                    </p>

                    <p
                        id="client-privatenotes" 
                        class="h-1/2 w-full"
                    >
                        <b>Private Notes: </b>{privateNote}
                    </p>
                </div>
                <button class="h-full w-10 bg-green-300" onClick={()=>
                        {setEditsOpen(true);
                        setPrice(price.slice(1))
                    }}>
                    E<br/>D<br/>I<br/>T
                </button>

            </div>
            </>
            )
    }
    }


    return(
        <>
            {Content()}
            <Modal open={deleteOpen} onClose={()=>{setDeleteOpen(false)}}>
                <h2>Sure you want to delete this student's records?</h2>
                All lesson records will be deleted <br/>
                This is a permanent action.<br/> 
                Your student and parent will be unable to access records as well. <br/><br/>
                <button class="bg-red-600 text-black" onClick={()=>deleteClient()}>I am certain I want to permanently delete this student record</button>
                <br/>
            </Modal>
        </>
    )
}
export default UpperDetails;