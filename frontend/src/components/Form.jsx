import { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import { ACCESS_TOKEN,REFRESH_TOKEN } from "../constants";
import "../styles/Form.css";
import GoogleLoginButton from "../components/GoogleAuth";
function Forms({route,method}) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    
    const name =method === "login" ? (<>
    <p>Log in to your Notes account</p>
    </>) : 
    (<>
    <p>Create your Notes account</p>
    </>);

    const handleSubmit = async (e) => {
        setLoading(true);
        e.preventDefault();
        

        try {
            const res= await api.post(route, {email, password});
            if(method === "login"){
                
                localStorage.setItem(ACCESS_TOKEN, res.data.access);
                localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
                navigate("/");
            }
            else{
                navigate("/login");
            }
        }
        catch (error) {
           alert("Error: " + error.message);
        }
        finally {
            setLoading(false);
        }
    }

    return (
        <>
         <form onSubmit={handleSubmit} className="form-container">
            <h1 className=''>Think it. Make it.</h1>
            {name}
            
            <GoogleLoginButton/>
            
            <input className="form-input" type="email" value={email} placeholder="Email" onChange={(e) => setEmail(e.target.value)} required />
            <input className="form-input" type="password" value={password} placeholder="Password" onChange={(e) => setPassword(e.target.value)} required />
            <button className="form-button" type="submit"></button>
                
        </form>
        </>
       
    )
}

export default Forms;