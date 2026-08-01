import { useNavigate } from 'react-router-dom';

function NavBar(){
    const nav = useNavigate()  
    return(
        <>
            <div class="h-10 w-screen p-px" id="navbar">
                <div class="flex flex-row h-full">
                    <div class="flex flex-row w-2/5 align-items" id="logo">
                        <p>Whatever I call this</p>
                    </div>
                    <div class="w-3/5 flex flex-row-reverse ">
                        <div class="w-1/4 justify-center ">
                            <button class ="bg-white border-none text-black content-center" onClick={()=>nav("/home/")}>Home</button>
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