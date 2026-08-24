import { useState, useEffect, useRef } from 'react'

import Modal from '../Modal'
import AddStudent from './addstudent'
import axios from 'axios'
import { Link, useNavigate } from "react-router-dom"
import NavBar from '../NavBar'
import { supabase } from '../lib/supabase/client';
import { Edit, Save, Plus} from 'lucide-react'


function TutorHome({ data }){
    const nav = useNavigate()

    const [addStudentOpen, setAddStudentOpen] = useState(false)
    const [allStudents, setStudents] = useState([])
    const [unpaidLessons,setUnpaidLessons] = useState([])
    const [tutorFirstName, setTutorFirstName] =useState("") 
    const [tutorLastName, setTutorLastName] =useState("") 
    const [tutorEmail, setTutorEmail] =useState("") 
    const [editDetails, setEditDetails] = useState(false)
    const [nextLessons, setNextLessons] = useState([])
    const [thisWeek, setThisWeek] = useState([])
    const formatter = new Intl.NumberFormat('default', {style: 'currency', currency: 'GBP'});
    

    const newChanges = useRef({});
    
    let gotStudents = false;

    const getStudents = async()=>{
        console.log("here")
        console.log(data)
        setStudents(data.students)
        setUnpaidLessons(data.unpaid)
        setTutorFirstName(data.tutor.first_name)
        setTutorLastName(data.tutor.last_name)
        setTutorEmail(data.tutor.email)
        setNextLessons(data.next3)
        setThisWeek(data.thisWeek)
    }
    

    useEffect(()=> {
        if (!gotStudents){
            gotStudents = true;
            getStudents();}
    }, [])

    async function updateUser(){
        if (Object.keys(newChanges.current).length!= 0){
            axios.post(
              `/api/users/updateuser`,
                {
                "changes": newChanges.current})
                .then()
        newChanges.current= {};
    }
    }

    

    return(
          <div className="h-screen w-screen flex flex-col bg-gray-50 overflow-hidden">
              <NavBar />
          
          <div className='h-1/10'>
              <div className="pr-5 h-full w-full flex flex-row bg-blue-600 pb-2">
                          <div className="pl-4 pr-10 flex flex-col text-left h-full w-2/3">
                              <h1 className='text 2xl text-white' >Hi {tutorFirstName}!</h1>
                              <h3 className='text-white w-full min-w-fit'>Welcome to the tutor homepage!</h3>
                              
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
                                          value={tutorFirstName}
                                          onChange = {e => {
                                              setTutorFirstName(e.target.value)
                                              newChanges.current["first_name"]=e.target.value}}
                                          className='h-min text-medium m-px w-full rounded-md px-2 py-1 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-white dark:text-white'
                                      />
                                      
                                      <input
                                          placeholder='Last Name'
                                          value={tutorLastName}
                                          onChange = {e => {
                                              setTutorLastName(e.target.value)
                                              newChanges.current["last_name"]=e.target.value}}
                                          className='text-medium m-px w-full rounded-md px-2 py-1 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-white dark:text-white'
                                      />

                                  </>

                                
                              : 
                                  <>
                                      <div className='flex flex-row justify-between text-left mt-1'>
                                          <h2 className='text-gray-100'>Your Details:</h2>
                                          <button onClick={()=>setEditDetails(!editDetails)}>
                                              <Edit />
                                          </button>
                                      </div>
                                      <h3 className='text-white'>First Name: {tutorFirstName}</h3>
                                      <h3 className='text-white'>Last Name: {tutorLastName}</h3>
                                      
                                  </>    
                              }
                              <h3 className='text-white'>Email: {tutorEmail}</h3>
                              <p className='pt-1 text-xs text-white'>Parents can see this when they view a linked student's page</p>

                          </div>

                          

                      </div>
          </div>
        

        <div className="flex-1 min-h-0 flex flex-row gap-4 p-4">

          <div className="w-1/3 h-full min-h-0 flex flex-col bg-white rounded-xl shadow-sm p-4">
            <button
              onClick={() => setAddStudentOpen(true)}
              className="w-full flex items-center justify-center gap-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 rounded-lg shadow-sm mb-3"
            >
              <Plus size={16} /> Add a student
            </button>

            <div className="flex-1 min-h-0 overflow-y-auto">
              <ul className="space-y-2">
                {allStudents.map(({ clientlink, description, default_price, start }) => (
                  <li key={clientlink} className="rounded-lg hover:bg-gray-50 border border-gray-100 p-3 transition-colors">
                    <Link to={`../student/${clientlink}`}>
                      <h2 className="font-medium text-gray-800">{description}</h2>
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>Default: {formatter.format(default_price)}</span>
                        <span>Since {(new Date(start).toUTCString().slice(5, -13))}</span>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="w-2/3 h-full min-h-0 flex flex-col gap-4">
          
          <div className='flex flex-row h-2/3'>

            <div className='w-1/2 h-full rounded-xl bg-white mr-4 p-4'>
                <h3 className="text-lg font-semibold text-gray-800">This Week</h3>
                <span className='text-xs font-semibold'>Total this week: {formatter.format(thisWeek.reduce((acc, cur) => cur.price + acc, 0))} <br></br>(including unpaid and incomplete lessons)</span>
              <div className="min-h-0 h-4/5 overflow-y-auto space-y-2">
                {thisWeek.map(({ clientlink, client_links, lessontime, price, title, lessonid }) => (
                  <div
                    key={lessonid}
                    onClick={() => nav(`/student/${clientlink}/lesson/${lessonid}`)}
                    className="cursor-pointer rounded-lg border border-gray-100 hover:border-blue-200 hover:bg-blue-50 px-3 py-2"
                  >
                    <div className="flex justify-between">
                      <div>
                        <p className="texl-xl text-gray-800">{client_links.description}</p>
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

            <div className="h-full w-1/2 min-h-0 bg-white rounded-xl shadow-sm p-4 flex flex-col">
              
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Your next lessons</h3>
              <div className="min-h-0 overflow-y-auto space-y-2">
                {nextLessons.map(({ clientlink, client_links, lessontime, price, title, lessonid }) => (
                  <div
                    key={lessonid}
                    onClick={() => nav(`/student/${clientlink}/lesson/${lessonid}`)}
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

            <div className="h-1/3 min-h-0 bg-white rounded-xl shadow-sm p-4 flex flex-col">
              <div className="flex flex-row justify-between items-center mb-2 shrink-0">
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

        <Modal open={addStudentOpen} onClose={() => setAddStudentOpen(false)}>
          <AddStudent />
        </Modal>
      </div>

    )
}

export default TutorHome