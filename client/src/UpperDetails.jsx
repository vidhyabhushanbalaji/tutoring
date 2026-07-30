import { useState, useEffect, useRef } from 'react'
import Modal from './Modal'
import axios from 'axios'


function UpperDetails({ details, setChange}){
    const [editsOpen, setEditsOpen] = useState(false)

    const [desc, setDesc] = useState(details.description)
    const [price, setPrice] = useState(details.default_price.slice(1,-1))
    const [publicNote, setPublicNote] =useState(details.publicnote)
    const [privateNote, setPrivateNote] =useState(details.privatenote)

    const newChanges = useRef({});



    function updateClient(){
        console.log("updated client");
    
    }


    function notesArea(){
        if(editsOpen){
            return(<p>save changes</p>)
        }
        return(
            <p>edit</p>
        )
    }


    return(
        <>
            <div class="pr-5 h-full w-full flex flex-row">
                <div class="pr-5 flex flex-col text-left h-full max-w-1/2 min-w-fit ">
                    <h1 class="w-auto">{details.description}</h1>
                    <div class="flex flex-row">
                            <h2 class="w-full">
                                Default Price: {details.default_price}
                            </h2>
                    </div>
                    <h2>Tutoring since : {new Date(details.start).toUTCString().slice(0,-13)}</h2> 
                    
                </div>
                <div class="w-full flex flex-col text-left h-full pr-5">
                    <textarea
                        id="client-publicnotes" 
                        placeholder='public note' 
                        class="h-1/2 w-full"
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
                        value = {privateNote}
                        onChange = {e => {
                        setPrivateNote(e.target.value);
                        newChanges.current["privateNote"]=e.target.value;
                    }}
                    />
                </div>
                <button class="h-full w-10" onClick={()=>
                    {setEditsOpen(!editsOpen);
                    if(editsOpen){
                        updateClient();
                    }}}>
                    {notesArea()}
                </button>

            </div>
        </>
    )
}
export default UpperDetails;