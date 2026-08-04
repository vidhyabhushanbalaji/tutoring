import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
function NavBar({ userType }){
    const nav = useNavigate()  

    function logOut(){
        localStorage.clear();
        nav('/login')
    }

    console.log("usertype")
    console.log(userType)

    return(
        <>
            <div class="h-10 w-screen p-px" id="navbar">
                <div class="flex flex-row h-full">
                    <div class="flex flex-row w-2/5 align-items" id="logo">
                        <h2 class="font-sans text-2xl">Find a good name!</h2>
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