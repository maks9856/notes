import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api"; // переконайся, що це твій axios або fetch wrapper

export default function EmailVerification() {
    const { uid, token } = useParams();
    const navigate = useNavigate();

    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const verifyEmail = async () => {
            try {
                const res = await api.post('/api/user/activation/', { uid, token });
                if (res.status === 200) {
                    navigate("/login", {
                        state: {
                            message: "Email verification successful. You can now log in."
                        }
                    });
                } else {
                    setError("Failed to verify email. Please try again.");
                }
            } catch (err) {
                setError("An error occurred during verification.");
            } finally {
                setLoading(false);
            }
        };

        verifyEmail();
    }, [uid, token, navigate]);

    return (
        <div className="authentication-container">
            <div className="form-container">
                {loading ? (
                    <p>Verifying email...</p>
                ) : error ? (
                    <div className="form-error">
                        <p>{error}</p>
                    </div>
                ) : null}
            </div>
        </div>
    );
}
