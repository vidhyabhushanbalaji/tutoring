import { useState, useEffect, useRef } from 'react'

import Modal from '../Modal'
import AddStudent from './addstudent'
import axios from 'axios'
import { Link, useNavigate } from "react-router-dom"
import NavBar from '../NavBar'
import { supabase } from '../supabaseClient';
import { Edit, Save } from 'lucide-react'

function TutorHome(){
    const nav = useNavigate()

    const [fetched, setFetched] = useState(false)
    const [userID, setUser] = useState("")

    useEffect(()=>{
        if (!fetched){
            const getUser = async()=> {
            const { data, error } = await supabase.auth.getUser()
            if (error){
                return "error"
            }
            else{
                return data.user.id
            }
            }
            setUser(getUser())
            setFetched(true)}
        },[])





    const [addStudentOpen, setAddStudentOpen] = useState(false)
    const [allStudents, setStudents] = useState([])
    const [unpaidLessons,setUnpaidLessons] = useState([])
    const [tutorFirstName, setTutorFirstName] =useState("") 
    const [tutorLastName, setTutorLastName] =useState("") 
    const [tutorEmail, setTutorEmail] =useState("") 
    const [editDetails, setEditDetails] = useState(false)

    const newChanges = useRef({});
    
    let gotStudents = false;

    const getStudents = async()=>{
            try{
            const session = await supabase.auth.getSession()
            await axios.post("https://localhost:443/home/getstudents",
                {headers:{Authorization: `Bearer: ${session.data.session.access_token}`}, 
                user: session.data.session.user.id}).then(res =>{
            console.log("here")
            console.log(res.data)
            setStudents(res.data.students)
            setUnpaidLessons(res.data.unpaid)
            setTutorFirstName(res.data.tutor.first_name)
            setTutorLastName(res.data.tutor.last_name)
            setTutorEmail(res.data.tutor.email)
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

    async function updateUser(){
        console.log("update");
        console.log(newChanges)
        if (Object.keys(newChanges.current).length!= 0){
            const session = await supabase.auth.getSession()
            axios.post("https://localhost:443/users/updateuser",
                {headers:
                    {Authorization: `Bearer: ${session.data.session.access_token}`},
                user: session.data.session.user.id,
                
                "changes": newChanges.current})
                .then(res=>{console.log("here")
            
            }
        )
        newChanges.current= {};
    }
    }

    

    return(
        <div className='h-screen w-screen overflow-y-auto flex flex-col overflow-y-auto'>
            

            
            
            <NavBar/>
            <div class="w-full flex flex-col h-1/5">
            
                
                <div class="pr-5 h-full w-full flex flex-row bg-blue-300">
                    <div class="pl-4 pr-10 flex flex-col text-left h-full w-2/3">
                        <h1 >Hi {tutorFirstName}!</h1>
                        <h3 className='text-black w-full min-w-fit'>Welcome to the tutor homepage!</h3>
                        
                    </div>

                
                    <div class="w-1/3 pl-2 flex flex-col text-left h-full pr-5 text-black overflow-y-auto overflow-x-auto">

                        
                            
                         

                        {editDetails ? 
                            <>
                                <div className='flex flex-row justify-between text-left mt-1'>
                                    <h2>Your Details:</h2>
                                    <button className='bg-green-300' onClick={()=>{updateUser(); setEditDetails(!editDetails)}}>
                                        <Save />
                                    </button>
                                </div>
                                
                                <input
                                    placeholder='First Name'
                                    value={tutorFirstName}
                                    onChange = {e => {
                                        setTutorFirstName(e.target.value)
                                        newChanges.current["first_name"]=e.target.value}}
                                    className='h-min text-medium m-px'
                                />
                                
                                <input
                                    placeholder='Last Name'
                                    value={tutorLastName}
                                    onChange = {e => {
                                        setTutorLastName(e.target.value)
                                        newChanges.current["last_name"]=e.target.value}}
                                    className='text-medium m-px'
                                />

                            </>

                           
                        : 
                             <>
                                <div className='flex flex-row justify-between text-left mt-1'>
                                    <h2>Your Details:</h2>
                                    <button onClick={()=>setEditDetails(!editDetails)}>
                                        <Edit />
                                    </button>
                                </div>
                                <h3>First Name: {tutorFirstName}</h3>
                                <h3>Last Name: {tutorLastName}</h3>
                                
                            </>    
                        }
                        <h3>Email: {tutorEmail}</h3>
                        <p className='pt-1 text-xs text-gray-600'>Parents can see this when they view a linked student's page</p>

                    </div>

                    

                </div>

            </div>
            
            
            <div class="flex flex-row h-4/5 min-h-0 gap-4">
                <div class="flex flex-col w-1/3 h-full pt-2">
                        <div id="addstudent" className='mb-2'>
                            <button 
                                onClick = {()=> setAddStudentOpen(true)}
                                className='w-4/5 justify-center bg-blue-400 hover:bg-blue-600 text-white font-medium border-none'>Add a student</button>
                        </div>
                        <div className='overflow-y-auto' >
                            <ul className='space-y-2'>
                                {allStudents.map(({ clientlink, description, default_price, start}) =>(
                                    <li className='rounded-lg hover:bg-gray-200 p-2 transition-colors'>
                                        <Link to={`../student/${clientlink}`}>
                                            <h2>{description}</h2>
                                            <div className='justify-between'>
                                                <p>Default price: {default_price}</p>
                                                <p>Tutoring Since: {(new Date(start).toUTCString().slice(5,-13))}</p>
                                            </div>
                                            </Link>
                                    </li>
                                ))}
                            </ul>
                    </div>
                </div>
                <div class="flex flex-col w-2/3 h-full min-h-0">
                        <div class="h-2/3">

                        </div>
                        
                        <div id ="unpaid" className='h-1/3 w-full flex flex-col'>
                            <div id="unpaid_title">
                                <h3>Unpaid lessons: {unpaidLessons.length}</h3>
                            </div>
                            <div className='overflow-y-auto'>
                            <table class="w-full text-sm text-left rtl:text-right text-body">
                                <thead class="border-b">
                                    <th>Client description</th>
                                    <th>Lesson Title</th>
                                    <th>Time</th>
                                    <th>Price</th>
                                </thead>
                                <tbody>
                                    {unpaidLessons.map(({ clientlink, client_links, lessontime, price, title}) =>(
                                    
                                    <tr 
                                        onClick={() => nav(`/student/${clientlink}`)}
                                        className="hover:text-blue-600">
                                        
                                        <th>{client_links.description}</th>
                                        <th>{title}</th>
                                        <th>{(new Date(lessontime).toUTCString().slice(0,-7))}</th>
                                        
                                        <th>{price}</th>
                                    </tr>
                                    
                                ))}
                                </tbody>
                            </table>
                            </div>
                        </div>
                </div>
            </div>

        <Modal open={addStudentOpen} onClose={()=> setAddStudentOpen(false)}>
            <AddStudent />
        </Modal>
        
        </div>

    )
}

export default TutorHome