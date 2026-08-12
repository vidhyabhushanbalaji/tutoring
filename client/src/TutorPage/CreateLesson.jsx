import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import axios from 'axios'
import Modal from '../Modal'
import { Loader } from 'lucide-react';


function CreateLesson({ default_price, clientlink, onAdd}){

    console.log(default_price)
    const nav = useNavigate()  
    const [time, setTime] = useState('')
    // update with default price
    const [price, setPrice] = useState(0)
    const [paid, setPaid] = useState(false)
    const [title, setTitle] = useState('')
    const [complete, setComplete] = useState(false)
    const [loadingOpen, setLoadingOpen] = useState(false)
    const formatter = new Intl.NumberFormat('default', {style: 'currency', currency: 'GBP'});

    useEffect(()=>{
        setPrice(formatter.format(default_price).slice(1))
    }, [default_price])
    
    async function handleSubmit(event){
        event.preventDefault();
        setLoadingOpen(true)
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
                onAdd({lessonid: res.data.lessonID, lessontime: time, title: title, paid: paid, complete: complete})
            }
            
            }).catch(err =>
            {

                console.log("unsuccesful entry attempt")
            }
            );
        }

    return(
       
       <section id="newLesson">
          <div class="flex flex-col w-full h-full p-2">
            <p className='justify-center h-min w-full text-white text-2xl bg-blue-600 rounded-xl text-left border-black p-4 mb-4'>New Lesson:</p>
            <form onSubmit={handleSubmit} className='px-4'>

                <div class="flex flex-col gap-4 pt-4">
                    <input 
                        class = "w-full text-6xl h-auto font-semibold bg-white border border-gray-300"
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

                    

                        <div class="flex flex-row gap-4 pt-4 h-full mb-10">
                        
                            <div className='w-1/3 flex flex-col'>
                                <span className='text-left'>Lesson Start Date and Time</span>
                                <input 
                                name ="date"
                                class="rounded-md border border-gray-400"
                                placeholder = "session date YYYY-MM-DD"
                                type="datetime-local"
                                value = {time}
                                onChange = {e => {
                                    setTime(e.target.value);
                                    newChanges.current["lessontime"]=e.target.value;
                                    alertChange();}}/>
                            </div>
                        
                        <div className='w-1/3 flex flex-col'>
                            <span className='text-left'>Lesson Price</span>
                            <div className='flex flex-row'>
                                <span className='text-xl mr-1'>£</span>
                                    <input 
                                    name ="price"
                                    class="rounded-md border border-gray-400"
                                    placeholder = "price"
                                    value = {price}
                                    onChange = {e => {
                                        if(!isNaN(e.target.value)){
                                            setPrice(e.target.value);
                                            newChanges.current["price"] = e.target.value;
                                            alertChange();}
                                        else{
                                            alert("price has to be a number only")
                                        }    
                                    }}
                                    />
                            </div>
                        </div>
                    </div>
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
            <button class="bg-blue-600 w-5/6 text-white text-xl ml-5">
              Add this lesson!
            </button>
          </form>
          
        </div>
        <Modal open={loadingOpen} onClose={()=>{setLoadingOpen(false)}}>
                <h1>Loading</h1>
                <Loader className="animate-bounce" size={300}/>
            </Modal>
      </section>
    )
}

export default CreateLesson;