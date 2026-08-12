import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { supabase } from './supabaseClient';
import { useState, useEffect } from 'react'

function NavBar({ userType }){
    
    const nav = useNavigate()  

    async function logOut(){
        const { error } = await supabase.auth.signOut()
        nav('/login')
    }

    

    return(
        <>
            <div class="h-10 w-screen p-px bg-gradient-to-r from-blue-600 to-blue-700 shadow-sm" id="navbar">
                <div class="flex flex-row h-full">
                    <div class="flex flex-row w-2/5 align-items" id="logo">
                        <h2 class="font-sans text-2xl text-black">HelpMeTutor!</h2>

                    </div>
                    <div class="w-3/5 flex flex-row-reverse">
                        <div class="w-1/4">
                                <button 
                                    class ="bg-white border-none text-black content-end"
                                    onClick = {()=>logOut()}><LogOut /></button>
                        </div>
                        <div class="w-1/4 justify-center ">
                            <button 
                            class ="bg-white border-none text-black content-end" 
                            onClick={()=>nav('/home')}>Home</button>
                        </div>
                        <div class="w-1/4 justify-center">
                            <button class ="bg-white border-none text-black content-end">Payments</button>
                        </div>

                    </div>
                </div>
            </div>
        </>


    )
}
export default NavBar;