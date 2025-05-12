import { Outlet } from "react-router-dom";
import { Link, useLocation } from "react-router-dom";
import '../styles/Base.css';
import useUser from "../hooks/useUser";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

export default function Base() {
  const { user, loading } = useUser();
  const [notes, setNotes] = useState([]);
  const navigate=useNavigate();

  const handleCreateNote = () => {
  const newNoteId = uuidv4();
  navigate(`/notes/${newNoteId}`);
  }; 
  const fetchNotes =()=>{
    api.get('/notes-api/notes/')
      .then((res) => setNotes(res.data))
      .catch((err) => console.error(err));
  } 

useEffect(() => {
  fetchNotes();
}, []);

    
    if (loading) return;
    if (!user) return;
  return (
    <div className="container">
      
        <nav className="sidebar-container">
          <div className="notes-sidebar-swicher">
              <span className="notes-sidebar-username">{user.username}</span>
              <button className="notes-sidebar-swicher-button" onClick={handleCreateNote}>
                <FontAwesomeIcon icon={faPen} />
              </button>
            </div>

          <div className="notes-sidebar-menu">
            <ul>
                <li>Search</li>
                <li><Link to="/notes">Home</Link></li>
            </ul>

            <h1>Private</h1>
              <ul>
                {notes.map((note) => (
                  <li key={note.id}>
                    {note.title.length > 15 ? note.title.slice(0, 15) + '…' : note.title}
                  </li>
                ))}
              </ul>

            <h1>Public</h1>
              <ul>
                <li>Note A</li>
                <li>Note B</li>
              </ul>

              <ul className="bottom-list">
                <li>Settings</li>
                <li>Trash</li>
              </ul>
          </div>


        </nav>
      <div className="div-content">
        <header className="header-notes-container"></header>
        <main className="main-notes-container">
             <Outlet context={{ fetchNotes }}/>
        </main>
         
      </div>
    </div>
  );
}
