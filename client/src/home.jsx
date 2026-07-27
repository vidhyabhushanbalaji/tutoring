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
    let gotStudents = false;

    const getStudents = async()=>{
            try{
            await axios.post("http://localhost:3000/home/getstudents",{tutor_id: userID}).then(res =>{
            console.log("here")
            console.log(res.data.students)
            setStudents(res.data.students)
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
                {allStudents.map(({ clientlink, description, default_price}) =>(
                    <li>
                        <Link to={`../student/${clientlink}`}>{description}, {default_price}</Link>
                    </li>
                ))}
            </ul>
        </div>

        </>
    )
}

export default Home