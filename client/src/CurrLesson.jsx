import { useState, useEffect } from 'react'

import Modal from './Modal'
import axios from 'axios'
import { Link } from "react-router-dom"
import CreateLesson from './CreateLesson'

function CurrLesson({ lessonID, clientlink }){
    console.log("lessonID"+lessonID)
    const userID = localStorage.getItem("id")
    console.log(userID)
    const [lessonDetails, setLD] = useState({})
    let gotLesson = false;

    const getLD = async(lessonID)=>{
        console.log("here2")
        if (lessonID!=-1){
            console.log("here3")
            try{
            await axios.post("http://localhost:3000/getlesson",{tutor_id: userID, lessonid: lessonID}).then(res =>{
                console.log("here")
                console.log(res.data)
                setLD(res.data)
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

    function handleSubmit(event){}
    
    const [time, setTime] = useState(lessonDetails.lessontime)
    // update with default price
    const [price, setPrice] = useState(lessonDetails.price)
    const [paid, setPaid] = useState(lessonDetails.paid)
    const [privateNotes, setPrivNotes] = useState(lessonDetails.privatenotes)
    const [publicNotes, setPubNotes] = useState(lessonDetails.publicNotes)
    const [title, setTitle] = useState(lessonDetails.title)
    console.log(price, paid, privateNotes, publicNotes, title)

    return(
        <>
        <form onSubmit={handleSubmit}>
            <input name ="title"
                size = "75"
                placeholder = "Title for session"
                value = {title}
                onChange = {e => setTitle(e.target.value)}
                style={{width: "400px", height:"40px" }}></input> 
            <br></br>

            <input name ="date"
            placeholder = "session date YYYY-MM-DD"
            type="datetime-local"
            value = {time}
            onChange = {e => setTime(e.target.value)}></input> 
            <br></br>

            <input name ="price"
            placeholder = "price"
            value = {price}
            onChange = {e => setPrice(e.target.value)}></input> 
            <br></br>

            <p>paid?</p>
            <input name ="paid" 
                    type="checkbox"
                    checked = {paid}
                    onChange = {e => setPaid(!paid)}
            ></input>
            <br></br>

            <textarea name ="publicNotes"
                    placeholder = "general notes"
                    value = {publicNotes}
                    onChange = {e => setPubNotes(e.target.value)}
                    style={{width: "100%", height:"200px" }}>
            </textarea> 
            <br></br>

            <textarea name ="privNotes"
                    placeholder = "private notes"
                    value = {privateNotes}
                    onChange = {e => setPrivNotes(e.target.value)}
                    style={{width: "100%", height:"150px" }}>
            </textarea> 
            <br></br>
            <button>Let's go!</button>
          </form>


        </>
    )
}

export default CurrLesson;