// https://demo.mobiscroll.com/react/popup/

//{allStudents.map(( { id, description, price })=>(
//                    <li>
//                        <Link to={`student/${id}`}>{description}, {price}</Link>
//                    </li>
//                ))}


import { useState, useEffect } from 'react'

import Modal from './Modal'
import AddStudent from './addstudent'
import axios from 'axios'
import { Link } from "react-router-dom"

function Home(){
    const userID = localStorage.getItem("id")
    console.log(userID)
    const [addStudentOpen, setAddStudentOpen] = useState(false)
    const [allStudents, setStudents] = useState([])

    const getStudents = async()=>{
        axios.post("http://localhost:3000/home/getstudents",{tutor_id: userID}).then(res =>{
            console.log("here")
            console.log(res.data.students)
            setStudents(res.data.students)
        }).catch(err=>{
            console.log("error")
        })
    }

    useEffect(()=> {
        getStudents();
    }, [])

    return(
        <>
        
        <Modal open={addStudentOpen} onClose={()=> setAddStudentOpen(false)}>
            <AddStudent />
        </Modal>

        

        
        <div id="id">
            <p>
                {userID}
            </p>
        </div>

        <div id="addstudent">
            <button onClick = {()=> setAddStudentOpen(true)}>Add a student</button>
        </div>

        <div id ="allstudents">
            <ul>

            </ul>
        </div>

        </>
    )
}

export default Home