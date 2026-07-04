import {BrowserRouter as Router, Link, Route, Routes, useParams} from "react-router-dom"
import { useState, useEffect } from 'react'
import axios from 'axios'
import CurrLesson from "./CurrLesson";
import CreateLesson from "./CreateLesson";


function Student(){
    const { id } = useParams();
    const tutorID = localStorage.getItem("id")
    let gotStudents = false;

    const [studentDetails, setSD] = useState({})
    const [lessons, setLessons] = useState([])
    const [currLesson, setCurrLesson] = useState(-1)

    const getStudents = async()=>{
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
        if (!gotStudents){
            gotStudents = true;
            getStudents();}
        }, [])

        useEffect(()=>{

        })
    
    console.log(studentDetails)
    console.log(lessons)

    return (
        <>
            <div id="upper details">
                <h1>{studentDetails.description}</h1>
                <h2>Default Price: {studentDetails.default_price}</h2> 
                <h2>Tutoring since : {studentDetails.start}</h2>
            </div>

            <table>
                <tr>
                    <th>
                        <h3>Lessons</h3>
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
                        <CurrLesson lessonID={currLesson} clientlink={id}/>
                    </th>
                </tr>
            </table>

        </>
    )
}

export default Student