import { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import { ACCESS_TOKEN,REFRESH_TOKEN } from "../constants";
import "../styles/Form.css";

function Forms({route,method}) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    
    const name =method === "login" ? "Login" : "Register";

    const handleSubmit = async (e) => {
        setLoading(true);
        e.preventDefault();
        

        try {
            const res= await api.post(route, {email, password});
            if(method === "login"){
                
                localStorage.setItem(ACCESS_TOKEN, res.data.access_token);
                localStorage.setItem(REFRESH_TOKEN, res.data.refresh_token);
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
        <form onSubmit={handleSubmit} className="form-container">
            <h1>{name}</h1>
            <input className="form-input" type="email" value={email} placeholder="Email" onChange={(e) => setEmail(e.target.value)} required />
            <input className="form-input" type="password" value={password} placeholder="Password" onChange={(e) => setPassword(e.target.value)} required />
            <button className="form-button" type="submit">{name}</button>
                
        </form>
    )
}

export default Forms;