import { useState, useEffect, useRef } from 'react'

import Modal from '../Modal'
import axios from 'axios'
import { Link, useNavigate } from "react-router-dom"
import NavBar from '../NavBar'
import { supabase } from '../supabaseClient';
import { Edit, Save } from 'lucide-react'

function ParentHome({ data }){
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

    const [allTutors, setTutors] = useState([])
    const [unpaidLessons,setUnpaidLessons] = useState([])
    const [parentFirstName, setParentFirstName] =useState("") 
    const [parentEmail, setParentEmail] =useState("") 
    const [parentLastName, setParentLastName] =useState("") 
    const [parentShareCode, setParentShareCode] = useState("")
    const [editDetails, setEditDetails] = useState(false)


    const newChanges = useRef({});
    
    var gotTutors = false;

    const getTutors = async()=>{
        setTutors(data.tutors)
        setUnpaidLessons(data.unpaid)
        setParentFirstName(data.parent.first_name)
        setParentLastName(data.parent.last_name)
        setParentEmail(data.parent.email)
        setParentShareCode(data.parent.authcode)
    }
    

    useEffect(()=> {
        if (!gotTutors){
            gotTutors = true;
            getTutors();}
    }, [])

    async function updateUser(){
        console.log("update");
        console.log(newChanges)
        if (Object.keys(newChanges.current).length!= 0){
            const session = await supabase.auth.getSession()
            axios.post("https://helpmetutor-backend.vercel.app:443/users/updateuser",
                {headers:
                    {Authorization: `Bearer: ${session.data.session.access_token}`},
                user: session.data.session.user.id,
                
                "changes": newChanges.current})
        newChanges.current= {};
    }
    }

    

    return(
        <div className='h-screen w-screen overflow-y-auto flex flex-col overflow-y-auto'>
            

            
            
            <NavBar 
                userType="parent"/>
            <div class="w-full flex flex-col h-1/5">
            
                
                <div class="pr-5 h-full w-full flex flex-row bg-blue-300">
                    <div class="pl-4 pr-10 flex flex-col text-left h-full w-2/3">
                        <h1 >Hi {parentFirstName}!</h1>
                        <h3 className='text-black w-full min-w-fit'>Welcome to the parent homepage!</h3>
                        
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
                                    value={parentFirstName}
                                    onChange = {e => {
                                        setParentFirstName(e.target.value)
                                        newChanges.current["first_name"]=e.target.value}}
                                    className='h-min text-medium m-px'
                                />
                                
                                <input
                                    placeholder='Last Name'
                                    value={parentLastName}
                                    onChange = {e => {
                                        setParentLastName(e.target.value)
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
                                <h3>First Name: {parentFirstName}</h3>
                                <h3>Last Name: {parentLastName}</h3>
                                
                            </>    
                        }
                        <h3>Email: {parentEmail}</h3>
                        <p className='pt-1 text-xs text-gray-600'>Tutors can see this when they view a linked student's page</p>

                    </div>

                    

                </div>

            </div>
            
            
            <div class="flex flex-row h-4/5 min-h-0 gap-4">
                <div class="flex flex-col w-1/3 h-full pt-2">
                        <div id="addstudent" className='mb-2'>
                            <h1 className='text-4xl'>All linked tutoring sessions</h1>
                        </div>
                        <div className='overflow-y-auto'>
                            <ul className='space-y-2'>
                                {allTutors.map(({ clientlink, description, default_price, start}) =>(
                                    <li className='rounded-lg hover:bg-gray-200 p-2 transition-colors'>
                                        <Link to={`../tutoring/${clientlink}`}>
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
                        <div class="h-2/3 overflow-y-auto">
                                <div className='border border-blue-300 my-5 mx-1'>
                                    <h2 className='text-3xl text-black'>Your Share Code: {parentShareCode}</h2>
                                    <h2 className='text-3xl text-black'>Your Email: {parentEmail}</h2>
                                    
                                </div>
                                <h2 className='text-2xl text-left mx-1'>So what do I do with this?</h2>
                                <p className='text-xl text-left'>
                                    Tutors need your email and share code to add you onto a student's records.<br/>
                                    Copy the details above and send to the tutor to allow them to join you onto the student's records.
                                </p>
                                <p className='text-xs text-left my-1'>Note: the share code may update when used</p>

                                <div className=' rounded-xl my-5 mx-2 py-1 border border-blue-300 border-radius hover:bg-blue-300'>
                                    <a href={`mailto:
                                        ?subject=Please%20add%20me%20to%20a%20student's%20records
                                        &body=Hi,%0D%0A%0D%0APlease%20add%20me%20to%20a%20student's%20records.%0D%0ATheir%20name%20is:[enter_name]%0D%0APlease%20see%20below%20my%20details:%0D%0A%0D%0AEmail:%20${parentEmail}%0D%0AShare%20Code:${parentShareCode}%20%0D%0A%0D%0AThanks,%0D%0A${parentFirstName}%20${parentLastName}`}>
                                    Generate an email with these details for me
                                    </a>
                                </div>
                                
                                
                                
                                
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
                                    {unpaidLessons.map(({ clientlink, description, lessontime, price, title}) =>(
                                    
                                    <tr
                                        onClick={() => nav(`/student/${clientlink}`)}
                                        className="hover:text-blue-600">
                                        
                                        <th>{description}</th>
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
        
        </div>

    )
}

export default ParentHome;