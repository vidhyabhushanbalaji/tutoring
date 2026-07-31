import { useState, useEffect, useCallback, useRef } from 'react'

import Modal from './Modal'
import axios from 'axios'
import { Link } from "react-router-dom"
import CreateLesson from './CreateLesson'

function CurrLesson({ lessonID, clientlink, changeLesson, removeLesson}){
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
    const [saved, setSaved] = useState('blue')
    const newChanges = useRef({});

    var changes = {};

    const getLD = async(lessonID)=>{
        console.log("here2")
        if (lessonID!=-1){
            console.log("here3")
            try{
            await axios.post("http://localhost:3000/getlesson",{tutor_id: userID, lessonid: lessonID}).then(res =>{
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
            await axios.post("http://localhost:3000/updatelesson",
            {"lessonid": lessonID,
            "tutor_id": userID,
            "changes": newChanges.current}).then(res=> 
            {if (res.status == 200){
                console.log("updated");
                setSaved('blue');
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
        if (saved=='blue') setSaved('red');
        debouncedUpdate();
    }

    function deleteLesson(){
        console.log("reached delete lesson")
        axios.post("http://localhost:3000/deletelesson",
            {"tutor_id": userID,
            "lessonid": lessonID,
            "clientlink": clientlink})
        .then(res=>{
            removeLesson(lessonID);
    })}

    const debouncedUpdate = debounce(()=>{autoUpdate();},1000)
   
    return(
        <>
        <div class="flex flex-col h-full ">
        
        <p class="h-min" style ={{backgroundColor: `${saved}`}}>Saved Status</p>

        <div class="h-max overflow-y-auto">
            <form >
                <div class="flex flex-col ">
                    <input 
                        class = "w-full text-6xl h-auto"
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
                    <br></br>

                    <div class="flex flex-row">
                        <input 
                        name ="date"
                        class="w-1/3"
                        placeholder = "session date YYYY-MM-DD"
                        type="datetime-local"
                        value = {time}
                        onChange = {e => {
                            setTime(e.target.value);
                            newChanges.current["lessontime"]=e.target.value;
                            alertChange();}}/>
                    
                        <input 
                        name ="price"
                        class="w-1/3"
                        placeholder = "price"
                        value = {price}
                        onChange = {e => {
                            setPrice(e.target.value);
                            newChanges.current["price"] = e.target.value; 
                            alertChange();           
                        }}/>
                    </div>
                    <br></br>

                    <p>paid?</p>
                    <input name ="paid" 
                        type="checkbox"
                        checked = {paid}
                        onChange = {e => {
                            setPaid(!paid);
                            newChanges.current["paid"] = !paid;
                            alertChange();}}
                    ></input>

                    <p>complete?</p>
                    <input name ="complete" 
                        type="checkbox"
                        checked = {complete}
                        onChange = {e => {
                            setComplete(!complete);
                            newChanges.current["complete"] = !complete;
                            alertChange();}}
                    ></input>

                    <br></br>

                    <textarea name ="publicNotes"
                        placeholder = "general notes"
                        maxLength="3000"
                        value = {publicNotes}
                        onChange = {e => {
                            setPubNotes(e.target.value);
                            newChanges.current["publicNotes"]=e.target.value;
                            alertChange();
                        }}
                        style={{width: "100%", height:"200px" }}>
                    </textarea> 
                    <br></br>

                    <textarea name ="privNotes"
                        placeholder = "private notes"
                        maxLength="2000"
                        value = {privateNotes}
                        onChange = {e => {
                            setPrivNotes(e.target.value);
                            newChanges.current["privateNotes"]=e.target.value;
                            alertChange();
                            
                        }}
                        style={{width: "100%", height:"150px" }}>
                    </textarea>
                    <br></br>
                </div>
            </form>
            <button class="bg-red-600 w-full" onClick={()=>setDeleteOpen(true)}>
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
        </div>
        </>
    )
}

export default CurrLesson;