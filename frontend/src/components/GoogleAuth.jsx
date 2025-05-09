import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import "../styles/GoogleAuth.css";
import googleLogo from "../assets/g-logo.png"; // Імпорт логотипу Google
const clientId = import.meta.env.VITE_CLIENT_ID;
const apiUrl = import.meta.env.VITE_API_URL;

const GoogleLoginButton = () => {
  const navigate = useNavigate();
  // Використання useGoogleLogin для обробки входу через Google
  const login = useGoogleLogin({
    onSuccess: async tokenResponse => {
     
      // Отримання access_token з Google
      const accessToken = tokenResponse.access_token;
      try {
        const response = await axios.post(`${apiUrl}/auth/convert-token/`, {
          token: accessToken,
          backend: 'google-oauth2',
          grant_type: 'convert_token',
          client_id: clientId,
        });
        const { access_token, refresh_token } = response.data;
        localStorage.setItem('access_token', access_token);
        localStorage.setItem('refresh_token', refresh_token);
        navigate("/");
      } catch (error) {
        console.error('Помилка при конвертації токена:', error);
      }
    },
    onError: error => console.error('Помилка входу:', error),
    scope: 'openid https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile',
  });

  return (
    <div className="google-authentication-container">
      <button type='button' className="google-authentication-button" onClick={() => login()}>
      <img src={googleLogo} alt="Google Logo"className="google-logo"/>
      Continue with Google
    </button>
    </div>
  
  
);
};

export default GoogleLoginButton;
