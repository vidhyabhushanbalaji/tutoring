import { useNavigate } from 'react-router-dom';
import { LogOut, HandCoins, House  } from 'lucide-react';
import axios from 'axios'

function NavBar({ userType }){
    
    const nav = useNavigate()  

    async function logOut(){
        await axios.post(
            '/api/users/logout',{}
        ).then(()=>{nav('/login')})
    }

    

    return(
        <>
            <div className="h-10 w-screen p-px bg-gradient-to-r bg-blue-600 shadow-sm" id="navbar">
                <div className="flex flex-row h-full">
                    <div className="flex flex-row w-2/5 align-items" id="logo">
                        <h2 className="font-sans text-2xl text-black">HelpMeTutor!</h2>

                    </div>
                    <div className="w-3/5 flex flex-row-reverse">
                        <div className="px-4 pt-0.5">
                                <button 
                                    className ="bg-white border-none text-black content-end"
                                    onClick = {()=>logOut()}><LogOut /></button>
                        </div>
                        <div className="px-4 pt-0.5 justify-center ">
                            <button 
                            className ="bg-white border-none text-black content-end" 
                            onClick={()=>nav('/home')}><House /></button>
                        </div>
                        <div className="px-4 pt-0.5 justify-center">
                            <button className ="bg-white border-none text-black content-end"
                            onClick={()=>nav('/payments')}><HandCoins/></button>
                        </div>

                    </div>
                </div>
            </div>
        </>


    )
}
export default NavBar;