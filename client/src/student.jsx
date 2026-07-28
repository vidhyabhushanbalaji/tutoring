import {BrowserRouter as Router, Link, Route, Routes, useParams} from "react-router-dom"
import { useState, useEffect } from 'react'
import axios from 'axios'
import CurrLesson from "./CurrLesson";
import CreateLesson from "./CreateLesson";


function Student(){
    useEffect(()=> {
        if (!gotLessons){
            gotLessons = true;
            getLessons();}
        }, [])


    const clientlink  = useParams().clientlink;
    const tutorID = localStorage.getItem("id")
    let gotLessons = false;

    const [studentDetails, setSD] = useState({})
    const [lessons, setLessons] = useState([])
    const [currLesson, setCurrLesson] = useState(-2)

    const getLessons = async()=>{
        try{
        console.log("clientlink "+clientlink)
        await axios.post("http://localhost:3000/studentdetail",{tutor_id: tutorID, clientlink: clientlink}).then(res =>{
            console.log(res)
            setSD(res.data.details)
            setLessons(res.data.lessons)
        })}
        catch{
            console.log("error")
        }
    }

        

    
    console.log(studentDetails)
    console.log(lessons)

    function LessonArea(currLesson){
        if (currLesson==-1){
            return(
                <CreateLesson default_price={studentDetails.default_price} clientlink={id} />
            )
        
        }
        else if (currLesson==-2){
            return(
                <>
                    <h1>Student statistics</h1>
                        <h2>No Lessons Paid: {/*studentDetails.totalLessons*/}</h2>
                        <h2>Total Paid: {/*studentDetails.totalPaid*/}</h2>
                        <h2>Unpaid Lessons: {/*studentDetails.unpaidLessonsSum*/}</h2>
                        <ul>
                            {/*studentDetails.unpaidLessons.map(({ lessontime, title, price, paid, lessonid }) =>(
                                <li key={lessonid}>
                                    <button onClick={() => setCurrLesson(lessonid)}>
                                        <b>{title}</b>
                                        <p>{lessontime}, {lessonid}</p>
                                    </button>
                                </li>
                            ))*/}
                        </ul>

                </>
            )
        }

        else{
                return(
                    <CurrLesson lessonID={currLesson} clientlink={clientlink} lessons={lessons} changeLesson={(changedLesson)=>{updateList(changedLesson)}}/>
                )
            }
    }

    function updateList(changedLesson){
        console.log("this ran!");
        console.log(lessons)
        const newLessons = []
        console.log("changed lesson")
        console.log(changedLesson)
        for (let lesson of lessons){
            console.log(lesson);
            if (lesson.lessonid==changedLesson.lessonid){
                newLessons.push({...lesson, "title": changedLesson.title, "lessontime":changedLesson.lessontime})
            }
            else{
                newLessons.push(lesson)
            }
        }
        console.log(newLessons)
        setLessons(newLessons)
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