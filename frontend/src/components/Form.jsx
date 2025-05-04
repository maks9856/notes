import { useState,useEffect } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import "../styles/Form.css";
import GoogleLoginButton from "../components/GoogleAuth";

function Forms({ route, method }) {
    const [text, setText] = useState("Continue");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate();

    const handleButtonClick = async (e) => {
        e.preventDefault();

        if (!showPassword) {
            if (email.trim() === "") {
                alert("Please enter an email address.");
                return;
            }
            setShowPassword(true);
            setText(method === "login" ? "Log in" : "Sign up");
            return;
        }

        // Якщо поле пароля вже відображається, виконується сабміт
        setLoading(true);
        try {
            const res = await api.post(route, { email, password });

            if (method === "login") {
                localStorage.setItem(ACCESS_TOKEN, res.data.access);
                localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
                navigate("/");
            } else {
                navigate("/login");
            }
        } catch (error) {
            alert("Error: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleButtonClick} className="form-container">
            <div className="form-header">
                <h1 className="headline">Think it. Make it.</h1>
                {method === "login" ? (
                    <h2 className="form-subtitle">Log in to your Notes account</h2>
                ) : (
                    <h2 className="form-subtitle">Create your Notes account</h2>
                )}
            </div>

            <GoogleLoginButton />

            <input
                className="form-input"
                type="email"
                value={email}
                placeholder="Email"
                onChange={(e) => setEmail(e.target.value)}
                required
            />

            {showPassword && (
                <input
                    className="form-input"
                    type="password"
                    value={password}
                    placeholder="Password"
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
            )}

            <button className="form-button" type="submit" disabled={loading}>
                {text}
            </button>
        </form>
    );
}

export default Forms;
