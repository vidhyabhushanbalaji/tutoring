//https://dev.to/miracool/how-to-manage-user-authentication-with-react-js-3ic5

/** 
import { useContext, createContext, useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from 'axios'

const AuthProvider = ({ children })=>{
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem("site")|| "")
    const navigate = useNavigate()
    const loginAction = async (data) =>{
        axios.post("http://localhost:3000/users/login",{email: email, password: pwd})
        .then(res=> {
            setUser(res.data.id) 
            localStorage.setItem("id", res.data.id)
            nav('/home')})
        .catch(err =>
        {
            console.log("unsuccesful login attempt")
            setPwd("")
            setEmail("")
        }
        );
        }
};

export default AuthProvider;

export const useAuth = () =>{
    return useContext(AuthContext);
}
*/