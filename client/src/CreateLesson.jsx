import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios'

function CreateLesson({ default_price, clientlink, onAdd }){
    console.log(default_price)

    const nav = useNavigate()  
    const userID = localStorage.getItem("id")
    const [date, setDate] = useState('')
    const [time, setTime] = useState('')
    // update with default price
    const [price, setPrice] = useState(default_price)
    const [paid, setPaid] = useState("false")
    const [privateNotes, setPrivNotes] = useState('')
    const [publicNotes, setPubNotes] = useState('')
    const [title, setTitle] = useState('')
    
    function handleSubmit(event){
        if (paid!="false"&&paid!="true"){
            setPaid(false)
            alert("issue on paid format")
            return;
        }
        event.preventDefault();
        const dbTime = date+"T"+time+":00.000Z"
        // when possible add parent id as well
        axios.post("http://localhost:3000/addlesson",
        {"lessontime": dbTime,
            "title": title,
            "privatenotes": privateNotes,
            "publicnotes": publicNotes,
            "price": price,
            "paid": paid,
            "tutor_id": userID,
            "clientlink": clientlink}).then(res=> 
            {if (res.status == 200){
                console.log("added")
                onAdd()
                const navlocation = '/student/'+clientlink
                console.log(navlocation)
                nav(navlocation)}
            
            }).catch(err =>
            {
                console.log("unsuccesful entry attempt")
            }
            );
        }
    

    return(
       <section id="newLesson">
        <div id="newLesson">

          <form onSubmit={handleSubmit}>
            <input name ="title"
            placeholder = "Title for session"
            value = {title}
            onChange = {e => setTitle(e.target.value)}></input> 
            <br></br>

            <input name ="date"
            placeholder = "session date YYYY-MM-DD"
            value = {date}
            onChange = {e => setDate(e.target.value)}></input> 

            <input name ="time"
            placeholder = "time as HH:MM"
            maxLength="5"
            value = {time}
            onChange = {e => setTime(e.target.value)}></input> 

            <input name ="price"
            placeholder = "price"
            value = {price}
            onChange = {e => setPrice(e.target.value)}></input> 

            <input name ="paid" 
                    value = {paid}
                    placeholder = "true or false paid"
                    onChange = {e => setPaid(e.target.value)}
            ></input>
            <input name ="publicNotes"
                    placeholder = "general notes"
                    value = {publicNotes}
                    onChange = {e => setPubNotes(e.target.value)}>
            </input> 
            <input name ="privNotes"
                    placeholder = "private notes"
                    value = {privateNotes}
                    onChange = {e => setPrivNotes(e.target.value)}>
            </input> 

            <br></br>
            <br></br>
            <button>Let's go!</button>
          </form>
        </div>
      </section>
    )
}

export default CreateLesson;