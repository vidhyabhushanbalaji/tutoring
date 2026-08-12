import { useState, useEffect, useCallback, useRef } from 'react'

import Modal from '../Modal'
import axios from 'axios'
import { supabase } from '../supabaseClient';
import { Loader } from 'lucide-react';


import { Link } from "react-router-dom"
import CreateLesson from './CreateLesson'

function CurrLesson({ lessonID, clientlink, changeLesson, removeLesson}){
    
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
    const formatter = new Intl.NumberFormat('default', {style: 'currency', currency: 'GBP'});
    const [loadingOpen, setLoadingOpen] = useState(true)

    var changes = {};

    const getLD = async(lessonID)=>{
        console.log("here2")
        if (lessonID!=-1){
            console.log("here3")
            try{
            const session = await supabase.auth.getSession()
            await axios.post("https://helpmetutor-backend.vercel.app:443/getlesson",
                {headers:{Authorization: `Bearer: ${session.data.session.access_token}`}, 
                    user: session.data.session.user.id, 
                    lessonid: lessonID}).then(res =>{
                console.log("here")
                setTime(res.data.lessontime.substring(0,16))
                setPrice(formatter.format(res.data.price).slice(1))
                setPaid(res.data.paid)
                setPrivNotes(res.data.privatenotes)
                setPubNotes(res.data.publicnotes)
                setTitle(res.data.title)
                setComplete(res.data.complete)
                setLoadingOpen(false)
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


    function debounce(func, delay=1000){
        console.log("here right now");
        console.log(changes);

        const timerRef = useRef(null);
        const debouncedFn = useCallback((... args) =>{
            if (timerRef.current) clearTimeout(timerRef.current);
            timerRef.current = setTimeout(()=>{
                func(...args);
            }, delay);
            
        }, [func, delay]);
        return debouncedFn;
    }

    async function autoUpdate(){
        console.log("i got called");
        console.log(newChanges.current);
        console.log(changes);
        const session = await supabase.auth.getSession()
            await axios.post("https://helpmetutor-backend.vercel.app:443/updatelesson",
            {headers:{Authorization: `Bearer: ${session.data.session.access_token}`}, 
            user: session.data.session.user.id, 
            "lessonid": lessonID,
            "changes": newChanges.current}).then(res=> 
            {if (res.status == 200){
                console.log("updated");
                setSaved(true);
                let listUpdate = {
                    title: title,
                    lessontime: time,
                    paid: paid
                }
                if ("title" in newChanges.current){
                    listUpdate.title = newChanges.current.title;
                    listUpdate.lessonid = lessonID;}
                if ("lessontime" in newChanges.current){
                    listUpdate.lessontime =newChanges.current.lessontime;
                    listUpdate.lessonid = lessonID}
                if ("paid" in newChanges.current){
                    listUpdate.paid =newChanges.current.paid;
                    listUpdate.lessonid = lessonID}
                // using whether the lessonID has been added as an indicator of whether the list needs updating
                if ("lessonid" in listUpdate){
                    listUpdate["lessonid"] = lessonID;
                    changeLesson(listUpdate)
                }
                newChanges.current = {};
            }
            }).catch(err =>
            {
                console.log("unsuccesful entry attempt")
            }
            );
        };
    function alertChange(){
        if (saved) setSaved(false);
        debouncedUpdate();
    }

    async function deleteLesson(){
        console.log("reached delete lesson")
        const session = await supabase.auth.getSession()
        axios.post("https://helpmetutor-backend.vercel.app:443/deletelesson",
            {headers:{Authorization: `Bearer: ${session.data.session.access_token}`}, 
            user: session.data.session.user.id,
            lessonid: lessonID,
            clientlink: clientlink})
        .then(res=>{
            removeLesson(lessonID);
    })}

    const debouncedUpdate = debounce(()=>{autoUpdate();},1000)
   
    return(
        <>
        <div class="flex flex-col h-full ">
        
        <p class="h-min text-white text-left" style ={{backgroundColor: saved ? '#6194FA' : 'red' }}>
            {`Saved Status: ${saved ? "All saved" : "Saving..."}`} </p>

        <div class="h-max overflow-y-auto bg-gray-50 p-5">
            <form >
                <div class="flex flex-col ">
                    <input 
                        class = "w-full text-6xl h-auto font-semibold bg-transparent border-none"
                        name ="title"
                        placeholder = "Title for session"
                        maxLength="127"
                        value = {title}
                        onChange = {e =>{
                            setTitle(e.target.value);
                            newChanges.current["title"]= e.target.value;
                            alertChange();
                            }}
                        ></input> 

                    <div class="flex flex-row gap-4 pt-4">
                        <input 
                        name ="date"
                        class="w-1/3 rounded-md border border-gray-400"
                        placeholder = "session date YYYY-MM-DD"
                        type="datetime-local"
                        value = {time}
                        onChange = {e => {
                            setTime(e.target.value);
                            newChanges.current["lessontime"]=e.target.value;
                            alertChange();}}/>
                    
                        <input 
                        name ="price"
                        class="w-1/3 rounded-md border border-gray-400"
                        placeholder = "price"
                        value = {price}
                        onChange = {e => {
                            if(!isNaN(e.target.value)){
                                setPrice(e.target.value);
                                newChanges.current["price"] = e.target.value;
                                alertChange();}
                            else{
                                alert("price has to be a number only")
                            }    
                        }}/>
                    </div>

                    <div class="flex flex-row gap-4 pt-4">
                    <label className={`flex-1 flex items-center justify-center gap-2 rounded-lg font-medium cursor-pointer border transition-colors ${paid ? 'bg-green-100 border-green-300 text-green-800' : 'bg-gray-200 text-gray-500'}`}>
                        paid
                        <input name ="paid"
                            type="checkbox"
                            checked = {paid}
                            onChange = {e => {
                                setPaid(!paid);
                                newChanges.current["paid"] = !paid;
                                alertChange();}}
                        />
                    </label>

                        <label className={`flex-1 flex items-center justify-center gap-2 rounded-lg font-medium cursor-pointer border transition-colors ${complete ? 'bg-blue-100 border-blue-300 text-green-800' : 'bg-gray-200 text-gray-500'}`}>
                            complete?
                            <input name ="complete" 
                                type="checkbox"
                                checked = {complete}
                                onChange = {e => {
                                    setComplete(!complete);
                                    newChanges.current["complete"] = !complete;
                                    alertChange();}}
                            />
                        </label>

                    </div>

                    <div className={`pt-5 text-black text-left`}>
                    <div className={`flex flex-row justify-between`}>
                        Student and Parent notes: 
                    <span className="text-xs text-gray-400">{publicNotes.length}/3000</span>
                    </div>
                    <textarea name ="publicNotes"
                        placeholder = "general notes"
                        maxLength="3000"
                        value = {publicNotes}
                        className='h-40 w-full'
                        onChange = {e => {
                            setPubNotes(e.target.value);
                            newChanges.current["publicnotes"]=e.target.value;
                            alertChange();
                        }}
                    >
                    </textarea> 
                    </div>

                    <div className={`pt-5 text-black text-left flex flex-row justify-between`}>
                    Private notes: only you can see
                    <span className="text-xs text-gray-400">{privateNotes.length}/2000</span>
                    </div>
                    <textarea name ="privNotes"
                        placeholder = "private notes"
                        maxLength="2000"
                        value = {privateNotes}
                        onChange = {e => {
                            setPrivNotes(e.target.value);
                            newChanges.current["privatenotes"]=e.target.value;
                            alertChange();
                        }}
                        className='h-32 w-full'
                    >
                    </textarea>
                    <br></br>
                </div>
            </form>
            <button class="bg-gray-300 w-full" onClick={()=>setDeleteOpen(true)}>
                    Delete this lesson
            </button>
            </div>
            
            <Modal open={deleteOpen} onClose={()=>{setDeleteOpen(false)}}>
                <h2>Sure you want to delete this lesson?</h2>
                This is a permanent action.<br/> 
                Your student and parent will be unable to access the lesson as well. <br/><br/>
                <button class="bg-red-600 text-black" onClick={()=>deleteLesson()}>I am certain I want to permanently delete this lesson</button>
                <br/>
            </Modal>
            <Modal open={loadingOpen} onClose={()=>{setLoadingOpen(false)}}>
                <h1>Loading</h1>
                <Loader className="animate-bounce" size={300}/>
            </Modal>
        </div>
        </>
    )
}

export default CurrLesson;