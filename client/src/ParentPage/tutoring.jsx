import {BrowserRouter as Router, Link, Route, Routes, useParams} from "react-router-dom"
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import Modal from '../Modal'
import axios from 'axios'
import CurrLesson from "./CurrLesson";
import NavBar from "../NavBar";
import UpperDetails from "./UpperDetails";
import { supabase } from '../supabaseClient';
import { Loader } from 'lucide-react';



function Tutoring(){
    const nav = useNavigate()  
    const [studentDetails, setSD] = useState({})
    const [price, setPrice]=useState("")
    const [lessons, setLessons] = useState([])
    const [currLesson, setCurrLesson] = useState(-2)
    const [loadingOpen, setLoadingOpen] = useState(true)


    useEffect(()=> {
        if (!gotLessons){
            gotLessons = true;
            getLessons();}
        }, [])


    const clientlink  = useParams().clientlink;
    const lesson = useParams().lesson;
    console.log("lesson" + lesson)
    let gotLessons = false;
    

    const getLessons = async()=>{
        try{
        const session = await supabase.auth.getSession()
        axios.post(`${import.meta.env.VITE_BACKEND_URL}/tutoringdetail`,
            {headers:{Authorization: `Bearer: ${session.data.session.access_token}`}, 
            user: session.data.session.user.id,
            clientlink: clientlink,})
        .then(res =>{
            setSD(res.data.details)
            setPrice(res.data.details.default_price)
            setLessons(res.data.lessons)
            setLoadingOpen(false)
            if (lesson){
                setCurrLesson(lesson)}
        })}
        catch{
            console.log("error")
        }
    }


    console.log(studentDetails)
    console.log(lessons)

    function LessonArea(currLesson){
        if (currLesson==-2){
            return(
                <>
                    <div className="w-full h-full p-2 ">
                        <p className="text-4xl text-black pb-2">
                            Hi!<br/>
                        </p>
                        <p className="text-2xl text-black text-left pb-2">
                            HelpMeTutor lets students and tutors keep an easier record of lessons, scheduling and payments. A tutor myself, I know how confusing all the spreadsheets, texts and meeting links can get so I built this for both tutors and parents. 
                        </p>
                        
                        <p className="text-2xl text-black mt-20">
                            Look for lessons your tutor has added on the left side of the screen!
                        </p>
                    </div>
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
                    userType="parent"
                />
                <div id="upper details" class="w-screen h-1/5 pl-4 pr-4 overflow-y-auto bg-blue-600">
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
                                
                            </div>
                            <div class="overflow-y-auto w-auto content-center mb-2">
                                {lessons.length===0 ? 
                                    (<p className="text-black text-center">
                                        No lessons added yet, check back soon!
                                    </p>) 
                                    : 
                                    (
                                        lessons.map(({ lessontime, title, lessonid }) =>(
                                            <div 
                                                onClick={() => setCurrLesson(lessonid)} 
                                                key={lessonid}
                                                className={`w-full cursor-pointer rounded-lg border border-x border-gray-300 p-3 my-2 transition-colors
                                                ${currLesson===lessonid ?
                                                    'bg-gray-200'
                                                    :"hover:translate-y-0.5"
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
            <Modal open={loadingOpen} onClose={()=>{setLoadingOpen(false)}}>
                <h1>Loading</h1>
                <Loader className="animate-bounce" size={300}/>
            </Modal>
        </>
    )
}

export default Tutoring;