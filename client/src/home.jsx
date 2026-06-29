//<popup display = "center" isOpen={addStudent} onClose={()=> setAddStudentOpen(false)}>
//            <button onPress ={()=> setAddStudentOpen(false)}
//                title = "close"/>
//        </popup>

// https://demo.mobiscroll.com/react/popup/
import { useState } from 'react'
import React from 'react'
import ReactDom from 'react-dom'
import Modal from './Modal'

function Home(){
    const userID = localStorage.getItem("id")
    console.log("homepage id = "+userID)
    const [addStudent, setAddStudentOpen] = useState(false)



    return(
        <>
        <div id="addstudent">
            <button onClick = {()=> setAddStudentOpen(true)}>Add a student</button>
        </div>

        <Modal open={addStudent} onClose={()=> setAddStudentOpen(false)}>
            <p>Hello</p>    
        </Modal>

        
        
        <div id="mainbody">
            <p>
                {userID}
            </p>
        </div>
        </>
    )
}

export default Home