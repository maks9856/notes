import '../styles/Notes.css';
import { useEffect, useState } from 'react';

export default function Notes() {
    const [greeting, setGreeting] = useState('');
    useEffect(() => {
        const hour = new Date().getHours();
        if (hour < 12) {
            setGreeting('Good morning!');
        } else if (hour < 18) {
            setGreeting('Good afternoon!');
        } else {
            setGreeting('Good evening!');
        };
    },[]);
    return (
        <div className="notes-container">
            <h1>{greeting}</h1>
            <h2>Recently visited</h2>
        </div>
    );
}