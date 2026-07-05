import {BrowserRouter as Router, Link, Route, Routes, useParams} from "react-router-dom"
import { useState, useEffect } from 'react'
import axios from 'axios'
import CurrLesson from "./CurrLesson";
import CreateLesson from "./CreateLesson";


function Student(){
    const { id } = useParams();
    const tutorID = localStorage.getItem("id")
    let gotLessons = false;

    const [studentDetails, setSD] = useState({})
    const [lessons, setLessons] = useState([])
    const [currLesson, setCurrLesson] = useState(-1)

    const getLessons = async()=>{
        try{
        await axios.post("http://localhost:3000/studentdetail",{tutor_id: tutorID, id: id}).then(res =>{
            console.log(res)
            setSD(res.data.details)
            setLessons(res.data.lessons)
        })}
        catch{
            console.log("error")
        }
        }

        useEffect(()=> {
        if (!gotLessons){
            gotLessons = true;
            getLessons();}
        }, [])

        useEffect(()=>{

        })
    
    console.log(studentDetails)
    console.log(lessons)

    function LessonArea(currLesson){
        if (currLesson==-1){
            return(
                <CreateLesson default_price={studentDetails.default_price} clientlink={id} onAdd={()=>{getLessons()}}/>
            )
        }
        else{
                return(
                    <CurrLesson lessonID={currLesson} clientlink={id}/>
                )
            }
    }


    return (
        <>
            <div id="upper details">
                <h1>{studentDetails.description}</h1>
                <h2>Default Price: {studentDetails.default_price}</h2> 
                <h2>Tutoring since : {studentDetails.start}</h2>
            </div>

            <table>
                <tr>
                    <th style={{width:"30%"}}>
                        <h3>Lessons</h3>
                        <button onClick={()=>setCurrLesson(-1)}>Add a new lesson</button>
                        <ul>
                            {lessons.map(({ lessontime, title, price, paid, lessonid }) =>(
                                <li key={lessonid}>
                                    <button onClick={() => setCurrLesson(lessonid)}>
                                        <b>{title}</b>
                                        <p>{lessontime}, {lessonid}</p>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </th>
                    <th>
                        {LessonArea(currLesson)}
                    </th>
                </tr>
            </table>

        </>
    )
}

export default Student