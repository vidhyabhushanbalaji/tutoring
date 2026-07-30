import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios'

function CreateLesson({ default_price, clientlink, onAdd}){
    console.log(default_price)
    let setprice = false
    const nav = useNavigate()  
    const userID = localStorage.getItem("id")
    const [time, setTime] = useState('')
    // update with default price
    const [price, setPrice] = useState(default_price)
    const [paid, setPaid] = useState(false)
    const [title, setTitle] = useState('')
    const [complete, setComplete] = useState(false)
    
    function handleSubmit(event){
        event.preventDefault();
        // when possible add parent id as well
        axios.post("http://localhost:3000/addlesson",
        {"lessontime": time,
            "title": title,
            "price": price,
            "paid": paid,
            "tutor_id": userID,
            "clientlink": clientlink,
            "complete": complete}).then(res=> 
            {if (res.status == 200){
                console.log("added")
                onAdd({lessonid: res.data.lessonID, lessontime: time, title: title})
            }
            
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
            size = "75"
            placeholder = "Title for session"
            value = {title}
            onChange = {e => setTitle(e.target.value)}
            style={{width: "400px", height:"40px" }}></input> 
            <br/><br/><br/>

            <input name ="date"
            placeholder = "session date YYYY-MM-DD"
            type="datetime-local"
            value = {time}
            onChange = {e => setTime(e.target.value)}></input> 
            <br/><br/><br/>

            <input name ="price"
            placeholder = "price"
            value = {price}
            onChange = {e => setPrice(e.target.value)}></input> 
            <br/><br/><br/>
            <label for ="paid">paid?</label>
            <input name ="paid" 
                    type="checkbox"
                    checked = {paid}
                    onChange = {e => setPaid(!paid)}
            ></input>
            <br/><br/>
            <label for ="complete">complete?</label>
            <input name ="complete" 
                    type="checkbox"
                    checked = {complete}
                    onChange = {e => setComplete(!complete)}
            ></input>

            <br/><br/><br/>
            <button>Add lesson</button>
          </form>
        </div>
      </section>
    )
}

export default CreateLesson;