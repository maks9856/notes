import '../styles/Notes.css';
import { useEffect, useState } from 'react';
import useUser from '../hooks/useUser';

export default function Notes() {
    const [greeting, setGreeting] = useState('');
    const { user, loading } = useUser();  // Хук викликається на початку

    useEffect(() => {
        const hour = new Date().getHours();
        if (hour < 12) {
            setGreeting('Good morning!');
        } else if (hour < 18) {
            setGreeting('Good afternoon!');
        } else {
            setGreeting('Good evening!');
        }
    }, []);
    
    if (loading) return  <p>Завантаження...</p>;
    if (!user) return <p>Неавторизований користувач</p>;

    return (
        <div className="notes-container">
            <h1>{greeting} {user.username}</h1>
            <h2>Recently visited</h2>
        </div>
    );
}
