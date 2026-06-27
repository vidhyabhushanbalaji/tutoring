//https://dev.to/miracool/how-to-manage-user-authentication-with-react-js-3ic5
import { useContext, createContext } from "react"
const AuthProvider = ({ children })=>{
    return <AuthContext.Provider>(children)</AuthContext.Provider>
};

export default AuthProvider;

export const useAuth = () =>{
    return useContext(AuthContext);
}