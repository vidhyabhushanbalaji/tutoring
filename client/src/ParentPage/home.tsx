import { useState, useEffect, useRef } from 'react'

import Modal from '../Modal'
import axios from 'axios'
import { Link, useNavigate } from "react-router-dom"
import NavBar from '../NavBar'
import { Edit, Save } from 'lucide-react'
import { parentHomeType } from '../types/parentHomeType'


function ParentHome(props: {data : parentHomeType}){
    const { data } = props
    const nav = useNavigate()
    const formatter = new Intl.NumberFormat('default', {style: 'currency', currency: 'GBP'});
    useEffect(()=>{
        console.log(data)
        setTutors(data.tutors)
        setUnpaidLessons(data.unpaid)
        setParentFirstName(data.parent.first_name)
        setParentLastName(data.parent.last_name)
        setParentEmail(data.parent.email)
        setParentShareCode(data.parent.authcode)
        setNextLessons(data.next3)
        },[data])

    const [allTutors, setTutors] = useState([])
    const [unpaidLessons,setUnpaidLessons] = useState([])
    const [parentFirstName, setParentFirstName] =useState("") 
    const [parentEmail, setParentEmail] =useState("") 
    const [parentLastName, setParentLastName] =useState("") 
    const [parentShareCode, setParentShareCode] = useState("")
    const [editDetails, setEditDetails] = useState(false)
    const [nextLessons, setNextLessons] = useState([])


    const newChanges = useRef({});
    
    var gotTutors = false;

    

    async function updateUser(){
        if (Object.keys(newChanges.current).length!= 0){
            axios.post(`/api/users/updateuser`,
                {"changes": newChanges.current})
        newChanges.current= {};
    }
    }

    

    return(
        <div className='h-screen w-screen overflow-y-auto flex flex-col bg-gray-50 overflow-hidden'>

            <NavBar 
                userType="parent"/>
            <div className="w-full flex flex-col h-1/5">
            
                
                <div className="pr-5 h-full w-full flex flex-row bg-blue-600">
                    <div className="pl-4 pr-10 flex flex-col text-left h-full w-2/3">
                        <h1 className='text-white' >Hi {parentFirstName}!</h1>
                        <h3 className='text-black w-full min-w-fit text-white'>Welcome to the parent homepage!</h3>
                        
                    </div>

                
                    <div className="w-1/3 pl-2 flex flex-col text-left h-full pr-5 text-black overflow-y-auto overflow-x-auto">

                        
                            
                         

                        {editDetails ? 
                            <>
                                <div className='flex flex-row justify-between text-left mt-1'>
                                    <h2 className='text-white'>Your Details:</h2>
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
                                    className='h-min text-medium m-px dark:text-white'
                                />
                                
                                <input
                                    placeholder='Last Name'
                                    value={parentLastName}
                                    onChange = {e => {
                                        setParentLastName(e.target.value)
                                        newChanges.current["last_name"]=e.target.value}}
                                    className='text-medium m-px dark:text-white'
                                />

                            </>

                           
                        : 
                             <>
                                <div className='flex flex-row justify-between text-left mt-1'>
                                    <h2 className='text-white'>Your Details:</h2>
                                    <button onClick={()=>setEditDetails(!editDetails)}>
                                        <Edit />
                                    </button>
                                </div>
                                <h3 className='text-white'>First Name: {parentFirstName}</h3>
                                <h3 className='text-white'>Last Name: {parentLastName}</h3>
                                
                            </>    
                        }
                        <h3 className='text-white'>Email: {parentEmail}</h3>
                        <p className='pt-1 text-xs text-white'>Tutors can see this when they view a linked student's page</p>

                    </div>

                    

                </div>

            </div>
            
            
            <div className="flex flex-row h-4/5 min-h-0 gap-4">
                <div className="w-1/3 h-full min-h-0 flex flex-col bg-white rounded-xl shadow-sm p-4">
                        <div id="tutors_titles">
                            <h1 className='text-4xl text-black'>All linked tutoring sessions</h1>
                        </div>
                         <div className="flex-1 min-h-0 overflow-y-auto">
                            <ul className='space-y-2'>
                                {allTutors.map(({ clientlink, description, default_price, start}) =>(
                                    <li className="rounded-lg hover:bg-gray-50 border border-gray-300 p-3 transition-colors">
                                        <Link to={`../tutoring/${clientlink}`}>
                                            <h2 className="font-medium text-gray-800">{description}</h2>
                                            <div className='justify-between'>
                                                <p>Default price: {formatter.format(default_price)}</p>
                                                <p>Tutoring Since: {(new Date(start).toUTCString().slice(5,-13))}</p>
                                            </div>
                                            </Link>
                                    </li>
                                ))}
                            </ul>
                    </div>
                </div>
                <div className="flex flex-col w-2/3 h-full min-h-0">
                        <div className="h-2/3 flex flex-row">

                            <div className='w-1/2 h-full rounded-xl bg-white mr-4 p-4 flex flex-col'>
                                <div className='border border-blue-600 my-5 mx-1 rounded-xl'>
                                    <p className='text-2xl text-black'>Your Share Code: {parentShareCode}</p>
                                    <p className='text-2xl text-black'>Your Email: {parentEmail}</p>
                                    
                                </div>
                                <h2 className='text-2xl text-left mx-1 text-black'>So what do I do with this?</h2>
                                <p className='text-xs text-left'>
                                    Tutors need your email and share code to add you onto a student's records.<br/>
                                    Copy the details above and send to the tutor to allow them to join you onto the student's records.
                                </p>
                                <p className='text-xs text-left my-1'>Note: the share code may update when used</p>

                                <div className=' rounded-xl my-5 mx-2 py-1 border border-blue-300 border-radius hover:bg-blue-300'>
                                    <a href={`mailto:
                                        ?subject=Please%20add%20me%20to%20a%20student's%20records
                                        &body=Hi,%0D%0A%0D%0APlease%20add%20me%20to%20a%20student's
                                        %20records.%0D%0ATheir%20name%20is:[enter_name]%0D%0APlease
                                        %20see%20below%20my%20details:%0D%0A%0D%0AEmail:%20${parentEmail}
                                        %0D%0AShare%20Code:${parentShareCode}%20%0D%0A%0D%0AThanks,%0D%0A
                                        ${parentFirstName}%20${parentLastName}`}>
                                    Generate an email with these details for me
                                    </a>
                                </div>
                            </div>

                            <div className="h-full w-1/2 bg-white rounded-xl shadow-sm p-4 flex flex-col">
                                
                                <h3 className="text-lg font-semibold text-gray-800 mb-3">Your next lessons</h3>
                                <div className="min-h-0 overflow-y-auto space-y-2">
                                {nextLessons.map(({ clientlink, client_links, lessontime, price, title, lessonid }) => (
                                    <div
                                    key={lessonid}
                                    onClick={() => nav(`/tutoring/${clientlink}/lesson/${lessonid}`)}
                                    className="cursor-pointer rounded-lg border border-gray-100 hover:border-blue-200 hover:bg-blue-50 px-3 py-2"
                                    >
                                    <div className="flex justify-between">
                                        <div>
                                        <p className="font-medium text-gray-800">{client_links.description}</p>
                                        <p className="text-sm text-gray-500">{title}</p>
                                        </div>
                                        <span className="text-sm font-medium text-gray-700">{formatter.format(price)}</span>
                                    </div>
                                    <p className="text-xs text-gray-400 mt-1">
                                        {(new Date(lessontime).toUTCString().slice(0, -7))}
                                    </p>
                                    </div>
                                ))}
                                </div>
                                </div>
                                
                            </div>
                                
                        
    
                        <div className="h-1/3 min-h-0 bg-white rounded-xl shadow-sm p-4 mt-2 flex flex-col">
                            <div className="flex flex-row justify-between items-center my-1 shrink-0">
                            <h3 className="text-sm font-semibold text-gray-800">Unpaid lessons: {unpaidLessons.length}</h3>
                            <h3 className="text-sm font-semibold text-red-600">
                                Total unpaid: {formatter.format(unpaidLessons.reduce((acc, cur) => cur.price + acc, 0))}
                            </h3>
                            </div>
                            <div className="flex-1 min-h-0 overflow-y-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="border-b border-gray-200 text-xs text-gray-500 uppercase bg-white">
                                <tr>
                                    <th className="py-1 font-medium">Client</th>
                                    <th className="py-1 font-medium">Lesson</th>
                                    <th className="py-1 font-medium">Time</th>
                                    <th className="py-1 font-medium text-right">Price</th>
                                </tr>
                                </thead>
                                <tbody>
                                {unpaidLessons.map(({ clientlink, client_links, lessontime, price, title, lessonid }) => (
                                    <tr
                                    key={lessonid}
                                    onClick={() => nav(`/student/${clientlink}/lesson/${lessonid}`)}
                                    className="cursor-pointer hover:bg-red-50 border-b border-gray-50"
                                    >
                                    <td className="py-2 text-gray-700">{client_links.description}</td>
                                    <td className="py-2 text-gray-700">{title}</td>
                                    <td className="py-2 text-gray-500">{(new Date(lessontime).toUTCString().slice(0, -7))}</td>
                                    <td className="py-2 text-right font-medium text-red-600">{formatter.format(price)}</td>
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