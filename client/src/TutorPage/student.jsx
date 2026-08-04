import {BrowserRouter as Router, Link, Route, Routes, useParams} from "react-router-dom"
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios'
import CurrLesson from "./CurrLesson";
import CreateLesson from "./CreateLesson";
import NavBar from "../NavBar";
import UpperDetails from "./UpperDetails";

function Student(){
    const nav = useNavigate()  
    const [studentDetails, setSD] = useState({})
    const [price, setPrice]=useState("")
    const [lessons, setLessons] = useState([])
    const [currLesson, setCurrLesson] = useState(-1)
    
    useEffect(()=> {
        if (!gotLessons){
            gotLessons = true;
            getLessons();}
        }, [])


    const clientlink  = useParams().clientlink;
    const tutorID = localStorage.getItem("id")
    let gotLessons = false;
    

    const getLessons = async()=>{
        try{
        console.log("clientlink "+clientlink)
        await axios.post("http://localhost:3000/studentdetail",{tutor_id: tutorID, clientlink: clientlink}).then(res =>{
            console.log(res)
            setSD(res.data.details)
            setPrice(res.data.details.default_price)
            console.log("set the details")
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

    function removeFromLessons(lessonID){
        const newLessons = lessons.filter((lesson)=>{return(lesson.lessonid!=lessonID)})
        setLessons(newLessons)
        setCurrLesson(-2)
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
                        <h2>Total Number of Lessons : {lessons.length}</h2>
                        <h2>Unpaid Lessons: {lessons.filter((lesson)=>(!lesson.paid)).length}</h2>
                        <table class="w-full text-sm text-left rtl:text-right text-body">
                            <thead class="border-b">
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
                        removeLesson={(lessonID)=>{removeFromLessons(lessonID)}}
                    />
                
                )
            }
    }

    



    return (
        <>
            
            <div id="full-screen" class="h-lvh pb-10">
                <NavBar
                    userType = "tutor"
                />
                <div id="upper details" class="w-screen h-1/5 pl-4 pr-4 overflow-y-auto bg-blue-100">
                    {()=>{console.log("student side details");console.log(studentDetails)}}
                    <UpperDetails
                                details = {studentDetails}
                                clientlink={clientlink} 
                                title={studentDetails.description} 
                                price = {studentDetails.default_price}
                                start = {new Date(studentDetails.start).toUTCString().slice(0,-13)}
                                setPriceChange = {(new_price)=>{console.log("i ran"); setPrice(new_price); console.log(price)}}
                    />
                    

                </div>
                

                <div class="h-4/5 w-screen flex flex-row bg-gray-50">

                        <div class="flex flex-col w-1/5 pt-4 pl-4">
                            <div class="h-min mb-2 content-center">
                                <h2 className="font-semibold">Lessons</h2>
                                <button 
                                onClick={()=>setCurrLesson(-1)}
                                className="w-4/5 justify-center bg-blue-400 hover:bg-blue-600 text-white font-medium border-black">
                                    <span className="text-lg">+</span> Add a new lesson
                                </button>
                            </div>
                            <div class="overflow-y-auto w-auto content-center mb-2">
                                {lessons.length===0 ? 
                                    (<p className="text-black text-center">
                                        Add your first lesson!
                                    </p>) 
                                    : 
                                    (
                                        lessons.map(({ lessontime, title, lessonid }) =>(
                                        <div 
                                            onClick={() => setCurrLesson(lessonid)} 
                                            key={lessonid}
                                            className={`w-full cursor-pointed rounded-xl shadow-sm content-center mb-2 border
                                            ${currLesson===lessonid ?
                                                'bg-blue-200 ring-2 ring-blue-300'
                                                :"bg-blue-50 hover:translate-y-0.5"
                                            }`}>
                                                <b>{title}</b>
                                                <p>{(new Date(lessontime).toUTCString().slice(0,-7))}</p>
                                        </div>

                                    )))
                                    
                                    }
                                
                            
                            </div>
                        </div>
                        <div class="w-4/5 ml-5 mr-5 mt-5 mb-5 border">
                            {LessonArea(currLesson)}
                        </div>
                </div>
                    
            </div>
        </>
    )
}

export default Student