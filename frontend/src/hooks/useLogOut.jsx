import api from '../api';
import { useNavigate } from 'react-router-dom';
import { ACCESS_TOKEN,REFRESH_TOKEN } from '../constants';

export default function useLogOut() {
    const navigate = useNavigate();
    const logout = async () => {
        const refreshToken = localStorage.getItem(REFRESH_TOKEN);
        try{
            if (refreshToken) {
                await api.post('/api/user/logout/', { refresh: refreshToken });

            }
        }catch (error) {
            console.error('Logout failed:', error);
        }
        finally{
            localStorage.removeItem(ACCESS_TOKEN);
            localStorage.removeItem(REFRESH_TOKEN);
            navigate("/login", { replace: true });
        }
    }
    return logout;
}