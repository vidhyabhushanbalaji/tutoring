import { useState, useEffect, useCallback, useRef } from 'react'

import Modal from '../Modal'
import axios from 'axios'
import { Link } from "react-router-dom"

function CurrLesson({ lessonID, clientlink}){
    console.log("lessonID"+lessonID)
    const userID = localStorage.getItem("id")
    console.log(userID)
    let lessonDetails = {}
    let gotLesson = false;

    const [deleteOpen, setDeleteOpen] = useState(false)
    const [time, setTime] = useState('')
    const [price, setPrice] = useState('')
    const [complete, setComplete] = useState(false)
    const [paid, setPaid] = useState(false)
    const [privateNotes, setPrivNotes] = useState('')
    const [publicNotes, setPubNotes] = useState('')
    const [title, setTitle] = useState('')
    const [saved, setSaved] = useState(true)
    const newChanges = useRef({});

    var changes = {};

    const getLD = async(lessonID)=>{
        console.log("here2")
        if (lessonID!=-1){
            console.log("here3")
            try{
            await axios.post("http://localhost:3000/tutoring/getlesson",{tutor_id: userID, lessonid: lessonID, clientlink: clientlink}).then(res =>{
                console.log("here")
                setTime(res.data.lessontime.substring(0,16))
                setPrice(res.data.price)
                setPaid(res.data.paid)
                setPrivNotes(res.data.privatenotes)
                setPubNotes(res.data.publicnotes)
                setTitle(res.data.title)
                setComplete(res.data.complete)

                console.log(lessonDetails)
            })}
            catch{
                console.log("error")
            }}
        }
    

    useEffect(()=> {
        if (lessonID!=-1 && !gotLesson){
            gotLesson = true;
            console.log("here1")
            getLD(lessonID);}
    }, [lessonID])



   
    return(
        <>
        <div class="flex flex-col h-full ">
        

        <div class="h-full overflow-y-auto bg-gray-50 p-5">
            <form >
                <div class="flex flex-col ">
                    <span 
                        class = "w-full text-6xl h-auto font-semibold bg-transparent border-none text-left"
                        name ="title"
                        placeholder = "Title for session"
                        value = {title}
                    >
                        {title}
                    </span>

                    <div class="flex flex-row gap-4 pt-4">
                        <span 
                        name ="time"
                        class="w-1/3 rounded-md border border-gray-400"
                        placeholder = "time"
                        >
                            {(new Date(time)).toUTCString().slice(0,-7)}</span>
                    
                        <span 
                        name ="price"
                        class="w-1/3 rounded-md border border-gray-400"
                        placeholder = "price"
                        >
                            {price}</span>
                    </div>

                    <div class="flex flex-row gap-4 pt-4">
                    <label className={`flex-1 flex items-center justify-center gap-2 rounded-lg font-medium cursor-pointer border transition-colors ${paid ? 'bg-green-100 border-green-300 text-green-800' : 'bg-gray-200 text-gray-500'}`}>
                        paid
                        <input name ="paid"
                            type="checkbox"
                            checked = {paid}
                        />
                    </label>

                        <label className={`flex-1 flex items-center justify-center gap-2 rounded-lg font-medium cursor-pointer border transition-colors ${complete ? 'bg-blue-100 border-blue-300 text-green-800' : 'bg-gray-200 text-gray-500'}`}>
                            complete?
                            <input name ="complete" 
                                type="checkbox"
                                checked = {complete}
                            />
                        </label>

                    </div>

                    <div className={`pt-5 text-black text-left h-full`}>
                    <div className={`flex flex-row justify-between h-full`}>
                        Student and Parent notes: 
                    <span className="text-xs text-gray-400">{publicNotes.length}/3000</span>
                    
                    </div>
                    <span className="text-xs text-gray-400">You can't edit these</span>
                    <textarea name ="publicNotes"
                        placeholder = "general notes"
                        className='min-h-full h-svh w-full border'
                        value={publicNotes}
                    />
                        
                    </div>

                    
                    <br></br>
                </div>
            </form>

            </div>
            
           
        </div>
        </>
    )
}

export default CurrLesson;