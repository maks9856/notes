import '../styles/Notes.css';
import { useEffect, useState } from 'react';
import useUser from '../hooks/useUser';

export default function Notes() {
    const [greeting, setGreeting] = useState('');
    const { user, loading } = useUser();

    useEffect(() => {
        const hour = new Date().getHours();
        if (hour < 12) {
            setGreeting('Good morning,');
        } else if (hour < 18) {
            setGreeting('Good afternoon,');
        } else {
            setGreeting('Good evening,');
        }
    }, []);
    
    if (loading) return  <p>Завантаження...</p>;
    if (!user) return <p>Неавторизований користувач</p>;

    return (
        <div className="notes-container">
            <div className="notes-main">
                <div className="notes-greeting">
                    <h1 className="user-greeting">{greeting} {user.username}!</h1>
                </div>
                <div className="notes-recent">
                    <h2 className="recent-title">Recently visited</h2>
                </div>
            </div>
        </div>
    );
}
