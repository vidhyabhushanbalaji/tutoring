// https://demo.mobiscroll.com/react/popup/

//{allStudents.map(( { id, description, price })=>(
//                    <li>
//                        <Link to={`student/${id}`}>{description}, {price}</Link>
//                    </li>
//                ))}


import { useState } from 'react'

import Modal from './Modal'
import AddStudent from './addstudent'
import axios from 'axios'
import { Link } from "react-router-dom"

function Home(){
    const userID = localStorage.getItem("id")
    console.log(userID)
    const [addStudentOpen, setAddStudentOpen] = useState(false)
    const [allStudents, getStudents] = useState({data: []})

    //var allStudents = [{ id: 13, description: "John", default_price: "$25.00" }]

    try{
        axios.post("http://localhost:3000/home/getstudents",{tutor_id: userID}).then( res =>{
            console.log("first")
            console.log(res.data)
            getStudents(res.data);})
    }
    catch{
        return(
            <>
                <p>error in fetching students</p>
            </>
        )
    }

    var students = {data: []}

    axios.post("http://localhost:3000/home/getstudents",{tutor_id: userID}).then( res =>{
            console.log("first")
            console.log(res.data)
            const { students } = (res.data);})
    
    console.log("here")
    console.log(students)

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
                {students[0].description}
            </ul>
        </div>

        </>
    )
}

export default Home