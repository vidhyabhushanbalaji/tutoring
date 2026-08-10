import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { supabase } from './supabaseClient';
import { useState, useEffect } from 'react'

function NavBar({ userType }){
    const [fetched, setFetched] = useState(false)
    const [user, setUser] = useState("")

    useEffect(()=>{
        if (!fetched){
            const getUser = async()=> {
            const { data, error } = await supabase.auth.getUser()
            if (error){
                return "error"
            }
            else{
                return data.user.id
            }
            }
            setUser(getUser())
            setFetched(true)}
        
    },[])

    
    
    const nav = useNavigate()  

    function logOut(){
        localStorage.clear();
        nav('/login')
    }

    

    return(
        <>
            <div class="h-10 w-screen p-px" id="navbar">
                <div class="flex flex-row h-full">
                    <div class="flex flex-row w-2/5 align-items" id="logo">
                        <h2 class="font-sans text-2xl text-black">HelpMeTutor!</h2>

                    </div>
                    <div class="w-3/5 flex flex-row-reverse ">
                        <div class="w-1/4 justify-center">
                                <button 
                                    class ="bg-white border-none text-black content-center"
                                    onClick = {()=>logOut()}><LogOut /></button>
                        </div>
                        <div class="w-1/4 justify-center ">
                            <button 
                            class ="bg-white border-none text-black content-center" 
                            onClick={()=>{
                                if(userType=="parent"){
                                    nav("/parent/home")}
                                else{
                                    nav("/tutor/home")
                                }}}>Home</button>
                        </div>
                        <div class="w-1/4 justify-center">
                            <button class ="bg-white border-none text-black content-center">Payments</button>
                        </div>

                    </div>
                </div>
            </div>
        </>


    )
}
export default NavBar;