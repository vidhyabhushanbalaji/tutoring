// https://demo.mobiscroll.com/react/popup/
import { useState } from 'react'

import Modal from './Modal'
import AddStudent from './addstudent'

function Home(){
    const userID = localStorage.getItem("id")
    const [addStudentOpen, setAddStudentOpen] = useState(false)

    

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

        </>
    )
}

export default Home