import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom';
import Modal from '../Modal'
import axios from 'axios'
import { Save, Trash2, SquarePen, X } from 'lucide-react';
import { supabase } from '../supabaseClient';



function UpperDetails({ details, setPriceChange}){
    let detailsSet = false;
    const nav = useNavigate()  
    const userID = localStorage.getItem("id")
    const [editsOpen, setEditsOpen] = useState(false)

    const [desc, setDesc] = useState("")
    const [price, setPrice] = useState("")
    const [publicNote, setPublicNote] =useState("")
    const [privateNote, setPrivateNote] =useState("")
    const [deleteOpen, setDeleteOpen] = useState(false)
    const [parentLinked, setParentLinked] = useState(false)
    
    const [parentFirstName, setParentFirstName] = useState("")
    const [parentLastName, setParentLastName] = useState("")
    const [parentEmail, setParentEmail] = useState("")
    const [authCode, setAuthCode] = useState("")
    const [removeParentOpen, setRemoveParentOpen] = useState(false)
    const [addParentOpen, setAddParentOpen] = useState(false)


    const newChanges = useRef({});
    const formatter = new Intl.NumberFormat('default', {style: 'currency', currency: 'GBP'});

    useEffect(()=> {
                console.log("recieved details")
                console.log(details)
                setDesc(details.description);
                setPrice(details.default_price)
                setPublicNote(details.public_note);
                setPrivateNote(details.private_note);
                var parent = {...details.parent}
                console.log(parent)
                if(Object.keys(parent).length!= 0){
                    setParentLinked(true);
                    console.log("found parent details")
                    setParentFirstName(parent.first_name);
                    setParentEmail(parent.email);
                    setParentLastName(parent.last_name);}
                
                
    }, [details])


    async function updateClient(){
        console.log("update");
        console.log(newChanges)
        if (Object.keys(newChanges.current).length!= 0){
            const session = await supabase.auth.getSession()
            axios.post("https://helpmetutor-backend.vercel.app:443/updateclient",
                {headers:{Authorization: `Bearer: ${session.data.session.access_token}`}, 
                user: session.data.session.user.id,
                "clientlink": details.clientlink,
                "changes": newChanges.current}).then(res=>{console.log("here")
            if("default_price" in newChanges.current){
                setPriceChange("£"+newChanges.current.default_price);
            }
            newChanges.current= {};
            }
        )
    }
    }

    async function deleteClient(){
        const session = await supabase.auth.getSession()
        axios.post("https://helpmetutor-backend.vercel.app:443/deleteclient",
            {headers:{Authorization: `Bearer: ${session.data.session.access_token}`}, 
            user: session.data.session.user.id,
            "clientlink": details.clientlink})
        .then(res=>{
            nav('/home')
    })}

    async function linkParent(){
        const session = await supabase.auth.getSession()
        axios.post("https://helpmetutor-backend.vercel.app:443/users/joinparent",
            {headers:{Authorization: `Bearer: ${session.data.session.access_token}`}, 
            user: session.data.session.user.id,
            "clientlink": details.clientlink,
            "parent_email": parentEmail,
            "authcode": authCode,

        })
    .then(res=>{
        console.log(res.data);
        setParentEmail(parentEmail);
        setAuthCode("")
        setParentFirstName(res.data.first_name);
        setParentLastName(res.data.last_name);
        setParentLinked(true);
        console.log(parentLinked)
    })}

    async function removeParent(){
        const session = await supabase.auth.getSession()
        axios.post("https://helpmetutor-backend.vercel.app:443/users/removeparent",
            {   headers:{Authorization: `Bearer: ${session.data.session.access_token}`}, 
                is_tutor: true,
                user: session.data.session.user.id,
                "clientlink": details.clientlink
            })
        .then((res)=>{
            setParentEmail("");
            setParentFirstName("");
            setParentLastName("");
            setParentLinked(false);
            setRemoveParentOpen(false);
    })}
    

    function ParentArea(){
        if (!parentLinked){
            return(
                <>
                    <button className='mt-1 w-full bg-green-300' onClick={()=>setAddParentOpen(true)}>Add a parent!</button>
                    <p className='text-xs'>Give access to a parent to view all lesson records.<br/>
                    They need to have an account signed up already, and you will need their email address.</p>
                    <Modal open={addParentOpen} onClose={()=>{setAddParentOpen(false)}}>
                        <h2>Add a parent</h2>
                        <p className='text-left'>
                        Step 1. The parent needs to create an account themselves, make sure they select status as 'Parent' during signup.<br/>
                        Step 2. Enter the email address they used to create the account below.<br/>
                        Step 3. On the parent's homepage they will have a 8 character authorisation code, enter this below.<br/>
                        Step 4. They will be able to see this tutoring activity on their homescreen when they login next.<br/><br/>
                        </p>
                        <input name = "email" 
                                className='w-4/5 mb-2 text-2xl'
                                placeholder = "Parent's email"
                                value = {parentEmail}
                                onChange = {
                                e => {setParentEmail(e.target.value)}
                                }
                        />
                        <input name = "authcode" 
                                className='w-4/5 mb-2 text-2xl'
                                placeholder = "Auth Code"
                                maxLength="8"
                                value = {authCode}
                                onChange = {
                                e => {setAuthCode(e.target.value)}
                            }
                        />

                        <button class="bg-green-600 text-black mb-2 w-4/5" onClick={()=>{linkParent()}}>I am certain the email is correct and I wish to grant this account permission to view the lesson records.</button>
                        <br/>
                    </Modal>
                </>
            )
        }
        else{
            return(
                <>
                <div className='flex flex-row justify-between text-left mt-1'>
                <h2>Parent:</h2>
                {editsOpen ? <button className='bg-red-500' onClick={()=>setRemoveParentOpen(true)}>
                    <X />
                </button>: `` }
                
                </div>
                    <h3>{parentFirstName}</h3>
                    <h3>{parentLastName}</h3>
                    <a href={`mailto:${parentEmail}`}>
                    <h3 className='hover:text-blue-500 text-xs'>{parentEmail}</h3></a>
                    <Modal open={removeParentOpen} onClose={()=>{setRemoveParentOpen(false)}}>
                        <h2>Sure you want to unlink this parent?</h2>
                        The parent will be unable to access the lesson records <br/>
                        Lessons's will not be deleted, and they can be readded.<br/>
                        If you want to change the parent linked to the record, first remove this parent and then you can add a different user.<br/><br/>
                        <button class="bg-red-600 text-black mb-2" onClick={()=>{setRemoveParentOpen(false); removeParent();}}>I am certain I want to remove this parent's access</button>
                        <br/>
                    </Modal>
                </>
            )
        }
    }


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
                        newChanges.current["public_note"]=e.target.value;
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
                        newChanges.current["private_note"]=e.target.value;
                    }}
                    />
                </div>
                <div
                    className='min-w-52 pr-4 text-left'>
                    
                        {ParentArea(parentLinked)}

                </div>


                <button class="h-full w-10 bg-green-300 mr-1" onClick={()=>
                    {   setEditsOpen(false);
                        updateClient();
                        
                    }}>
                    <Save size={16}/>
                </button>
                <button class="h-full w-10 bg-red-600" onClick={()=>setDeleteOpen(true)}>
                    <Trash2 size={16}/>
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
                                Default Price: {formatter.format(price)}
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

                <div
                    className='min-w-52 pr-4 text-left'>
                        {ParentArea(parentLinked)}                        
                    </div>


                <button class="h-full w-10 bg-green-300" onClick={()=>
                        {setEditsOpen(true);
                        
                    }}>
                    <SquarePen />
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
                <button class="bg-red-600 text-black mb-2" onClick={()=>deleteClient()}>I am certain I want to permanently delete this student record</button>
                <br/>
            </Modal>
        </>
    )
}
export default UpperDetails;