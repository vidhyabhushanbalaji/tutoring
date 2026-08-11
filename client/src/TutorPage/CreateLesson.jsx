import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import axios from 'axios'

function CreateLesson({ default_price, clientlink, onAdd}){

    console.log(default_price)
    const nav = useNavigate()  
    const [time, setTime] = useState('')
    // update with default price
    const [price, setPrice] = useState(0)
    const [paid, setPaid] = useState(false)
    const [title, setTitle] = useState('')
    const [complete, setComplete] = useState(false)

    useEffect(()=>{
        setPrice(default_price)
    }, [default_price])
    
    async function handleSubmit(event){
        event.preventDefault();
        const session = await supabase.auth.getSession()
        axios.post("https://helpmetutor-backend.vercel.app:443/addlesson",
        {headers:{Authorization: `Bearer: ${session.data.session.access_token}`}, 
        user: session.data.session.user.id,
        newLesson:
            {"lessontime": time,
            "title": title,
            "price": price,
            "paid": paid,
            "clientlink": clientlink,
            "complete": complete}}).then(res=> 
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
          <div class="flex flex-col ">
            <p className='justify-center h-min w-full text-white text-4xl pb-6 bg-blue-400 rounded-xl content-center border-black p-4 mb-8'>New Lesson:</p>
            <form onSubmit={handleSubmit}>
                    <input 
                        class = "w-full text-6xl h-auto font-semibold bg-transparent border-none mb-10 pl-4 pr-4"
                        name ="title"
                        placeholder = "Title for the new session"
                        maxLength="127"
                        value = {title}
                        onChange = {e =>{
                            setTitle(e.target.value);
                            newChanges.current["title"]= e.target.value;
                            alertChange();
                            }}
                        ></input> 

                    

                    <div class="flex flex-row gap-4 pt-4 justify-center h-full mb-10">
                        <input 
                        name ="date"
                        class="w-1/3 rounded-md border border-gray-400"
                        placeholder = "session date YYYY-MM-DD"
                        type="datetime-local"
                        value = {time}
                        onChange = {e => {
                            setTime(e.target.value);
                            newChanges.current["lessontime"]=e.target.value;
                            alertChange();}}/>
                    
                        <input 
                        name ="price"
                        class="w-1/3 rounded-md border border-gray-400"
                        placeholder = "price"
                        value = {price}
                        onChange = {e => {
                            setPrice(e.target.value);
                            newChanges.current["price"] = e.target.value; 
                            alertChange();           
                        }}/>
                    </div>

                    <div class="flex flex-row gap-4 pt-4 pb-4 mb-10 mr-5 ml-5">
                    <label className={`flex-1 flex items-center justify-center gap-2 rounded-lg font-medium cursor-pointer border transition-colors p-5  text-xl ${paid ? 'bg-green-100 border-green-300 text-green-800' : 'bg-gray-200 text-gray-500'}`}>
                        paid?
                        <input name ="paid"
                            type="checkbox"
                            checked = {paid}
                            onChange = {e => {
                                setPaid(!paid);
                                newChanges.current["paid"] = !paid;
                                alertChange();}}
                        />
                    </label>

                        <label className={`flex-1 flex items-center justify-center gap-2 rounded-lg font-medium cursor-pointer border transition-colors p-5 text-xl ${complete ? 'bg-blue-100 border-blue-300 text-green-800' : 'bg-gray-200 text-gray-500'}`}>
                            complete?
                            <input name ="complete" 
                                type="checkbox"
                                checked = {complete}
                                onChange = {e => {
                                    setComplete(!complete);
                                    newChanges.current["complete"] = !complete;
                                    alertChange();}}
                            />
                        </label>

                    </div>
            <div className=''></div>
            <button class="bg-blue-400 w-5/6 text-white text-xl ml-5">
              Add this lesson!
            </button>
          </form>
        </div>
      </section>
    )
}

export default CreateLesson;