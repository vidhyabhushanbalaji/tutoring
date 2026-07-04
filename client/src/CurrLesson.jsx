import { useState, useEffect } from 'react'

import Modal from './Modal'
import axios from 'axios'
import { Link } from "react-router-dom"
import CreateLesson from './CreateLesson'

function CurrLesson({ lessonID, clientlink }){
    console.log("lessonID"+lessonID)
    const userID = localStorage.getItem("id")
    console.log(userID)
    const [lessonDetails, setLD] = useState([])
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

    if (lessonID==-1){
        return(
            <CreateLesson default_price="5" clientlink={clientlink}/>
        )
    }

    

    return(
        <>
        <h1>{lessonDetails.title}</h1>
        <h2></h2>


        </>
    )
}

export default CurrLesson;