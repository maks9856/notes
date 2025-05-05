import { useState } from "react";
import api from "../api";

export default function ResetPassword() {
    const [buttonText, setButtonText] = useState('Send Reset Link');
    const [email, setEmail] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleButtonClick = async (e) => {
        e.preventDefault();

        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!email) {
            setError("Please enter an email address.");
            return;
        }
        if (!emailRegex.test(email)) {
            setError("Please enter a valid email address.");
            return;
        }

        setLoading(true);
        try {
            const res = await api.post('/auth/reset-password', { email });
            if (res.status === 200) {
                setButtonText('Reset Link Sent!');
                setError(null);
            } else {
                setError("Failed to send reset link. Please try again.");
            }
        } catch (error) {
            setError("Server error: " + (error?.response?.data?.detail || error.message));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h1>Reset Password</h1>
            <form onSubmit={handleButtonClick} noValidate>
                <input
                    type="email"
                    maxLength={255}
                    name="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => {
                        setEmail(e.target.value);
                        setError(null);
                    }}
                    required
                />

                {error && (
                    <div className="reset-error">
                        <p>{error}</p>
                    </div>
                )}

                <button type="submit" disabled={loading}>
                    {buttonText}
                </button>
            </form>
        </div>
    );
}
