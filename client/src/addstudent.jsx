import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios'


function AddStudent(){
    const nav = useNavigate()  
    const [desc, setDesc] = useState('')
    const [price, setPrice] = useState(0)

    const userID = localStorage.getItem("id")

    function handleSubmit(event){
        event.preventDefault();
        axios.post("http://localhost:3000/users/addclient/",
            {description: desc, 
             tutor_id: userID,
             price: price})
        .then(res=> {
            console.log(res)
            const clientstudentID = res.data.clientlink
            console.log("got id of"+clientstudentID)
            const navlocation = '/student/'+clientstudentID
            console.log(navlocation)
            nav(navlocation)}
        ).catch(err =>
        {
            console.log("unsuccesful add attempt")
            setDesc("")
            setPrice(0)
        }
    )}

    return(
        <form onSubmit={handleSubmit}>
            <input name ="description"
            placeholder = "Title for your new tutoring client"
            value = {desc}
            onChange = {e => setDesc(e.target.value)}></input> 
            <br></br>
            £<input name = "price" 
                    placeholder = "Default price for a lesson"
                    value = {price}
                    onChange = {e => {if (!isNaN(e.target.value)){setPrice(e.target.value)}}}
            ></input>
            <p>Note: parent and student will be linked in the next page</p>


            <button>Add new tutoring role</button>
          </form>
    )
}
export default AddStudent