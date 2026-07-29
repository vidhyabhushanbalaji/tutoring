import {BrowserRouter as Router, Link, Route, Routes, useParams} from "react-router-dom"
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios'
import CurrLesson from "./CurrLesson";
import CreateLesson from "./CreateLesson";


function Student(){
    const nav = useNavigate()  
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

    function updateList(changedLesson){
        console.log("this ran!");
        console.log(lessons)
        const newLessons = []
        console.log("changed lesson")
        console.log(changedLesson)
        for (let lesson of lessons){
            console.log(lesson);
            if (lesson.lessonid==changedLesson.lessonid){
                newLessons.push({...lesson, "title": changedLesson.title, "lessontime":changedLesson.lessontime, "paid": changedLesson.paid})
            }
            else{
                newLessons.push(lesson)
            }
        }
        console.log(newLessons)
        setLessons(newLessons)
    }

    function addIntoList(newLesson){
        console.log(newLesson)
        const newTime = (new Date(newLesson.lessontime)).getTime()
        const newLessons = []
        var count = 0
        while ((count<lessons.length) && (newTime < (new Date(lessons[count].lessontime).getTime()))){
            newLessons.push(lessons[count++])
        }
        newLessons.push(newLesson)
        while(count<lessons.length){
            newLessons.push(lessons[count++])
        }
        setLessons(newLessons)
        setCurrLesson(newLesson.lessonid)
    }

    console.log(studentDetails)
    console.log(lessons)

    function LessonArea(currLesson){
        if (currLesson==-1){
            return(
                <CreateLesson 
                    default_price={studentDetails.default_price} 
                    clientlink={clientlink} 
                    onAdd={(newLesson)=>{addIntoList(newLesson)}}
                />
            )
        
        }
        else if (currLesson==-2){
            return(
                <>
                        <h2>No Lessons : {lessons.length}</h2>
                        <h2>Unpaid Lessons: {lessons.filter((lesson)=>(!lesson.paid)).length}</h2>
                        <table class="w-full text-sm text-left rtl:text-right text-body">
                            <thead class="bg-neutral-secondary-soft border-b border-default">
                                <th>lessontime</th>
                                <th>title</th>
                                <th>price</th>
                                <th>lessonid</th>
                            </thead>
                            <tbody>
                                {lessons.filter((lesson)=>(!lesson.paid)).map(({ lessontime, title, price, lessonid }) =>(
                                <tr onClick={() => setCurrLesson(lessonid)}>
                                    <th>{(new Date(lessontime).toUTCString().slice(0,-7))}</th>
                                    <th>{title}</th>
                                    <th>{price}</th>
                                    <th>{lessonid}</th>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                </>
            )
        }

        else{
                return(
                    <CurrLesson 
                        lessonID={currLesson} 
                        clientlink={clientlink} 
                        lessons={lessons} 
                        changeLesson={(changedLesson)=>{updateList(changedLesson)}}
                    />
                )
            }
    }

    



    return (
        <>
            <div id="full-screen" class="h-screen w-screen">
            
                <div id="upper details" class="w-screen h-3/10">
                    <button onClick={()=>nav("/home/")}>Home</button>
                    <h1 onClick={()=>setCurrLesson(-2)}>{studentDetails.description}</h1>
                    <h2>Default Price: {studentDetails.default_price}</h2> 
                    <h2>Tutoring since : {studentDetails.start}</h2>
                </div>
                

                <div class="h-screen w-screen flex flex-row">
                        
                        <div class="h-7/10 w-1/5 overflow-y-auto">
                            <h3>Lessons</h3>
                            <button onClick={()=>setCurrLesson(-1)}>Add a new lesson</button>
                                <ul>
                                    <hr/>
                                    {lessons.map(({ lessontime, title, lessonid }) =>(
                                        
                                        <li key={lessonid}>
                                            <hr/>
                                            <button onClick={() => setCurrLesson(lessonid)}>
                                                <b>{title}</b>
                                                <p>{(new Date(lessontime).toUTCString().slice(0,-7))}</p>
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                        </div>
                        <div class="w-4/5 overflow-y-auto">
                            {LessonArea(currLesson)}
                        </div>
                </div>
                    
            </div>
        </>
    )
}

export default Student