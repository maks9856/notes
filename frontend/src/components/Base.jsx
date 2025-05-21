import { Outlet } from "react-router-dom";
import { Link, useLocation } from "react-router-dom";
import "../styles/Base.css";
import useUser from "../hooks/useUser";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import { faEllipsis } from "@fortawesome/free-solid-svg-icons";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { faArrowDown } from "@fortawesome/free-solid-svg-icons";
import { faClockRotateLeft } from "@fortawesome/free-solid-svg-icons";
import { faStar as faStarSolid } from "@fortawesome/free-solid-svg-icons";
import { faStar as faStarRegular } from "@fortawesome/free-regular-svg-icons";
import { useEffect, useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

export default function Base() {
  const { user, loading } = useUser();
  const [notes, setNotes] = useState([]);
  const [noteTitle, setNoteTitle] = useState("");
  const [isFavorite, setIsFavorite] = useState(false);
  const { pathname } = useLocation();
  const [selectedNoteUuid, setSelectedNoteUuid] = useState("");

  const navigate = useNavigate();

  const handleCreateNote = () => {
    const newNoteId = uuidv4();
    navigate(`/notes/${newNoteId}`);
  };
  const fetchNotes = () => {
    api
      .get("/notes-api/notes/")
      .then((res) => setNotes(res.data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchNotes();
  }, []);
  useEffect(() => {
    const uuidFromPath = pathname.split("/").at(-1);
    const found = notes.find((note) => note.uuid === uuidFromPath);
    if (found) {
      setNoteTitle(found.title);
      setIsFavorite(found.is_favorite);
      setSelectedNoteUuid(found.uuid);
    } else {
      setNoteTitle("");
      setSelectedNoteUuid("");
    }
  }, [pathname, notes]);

  const toggleFavorite = async () => {
    if (!selectedNoteUuid) return;
    try {
      await api
        .get(`/notes-api/notes/${selectedNoteUuid}/`)
        .then((res) => {
          setIsFavorite(res.data);
        })
        .catch((err) => console.error(err));
    } catch (error) {}
    try {
      const updatedValue = !isFavorite;
      await api.put(`/notes-api/notes/${selectedNoteUuid}/`, {
        is_favorite: updatedValue,
      });
      setIsFavorite(updatedValue);
      fetchNotes();
    } catch (error) {
      console.error("Failed to update favorite status", error);
    }
  };

  if (loading) return;
  if (!user) return;
  return (
    <div className="container">
      <nav className="sidebar-container">
        <div className="notes-sidebar-swicher">
          <span className="notes-sidebar-username">{user.username}</span>
          <button
            className="notes-sidebar-swicher-button"
            onClick={handleCreateNote}
          >
            <FontAwesomeIcon icon={faPen} />
          </button>
        </div>

        <div className="notes-sidebar-menu">
          <ul>
            <li>Search</li>
            <li>
              <Link to="/notes">Home</Link>
            </li>
          </ul>

          <h1>Private</h1>
          <ul>
            {notes.map((note) => (
              <li key={note.id} onClick={() => navigate(`/notes/${note.uuid}`)}>
                {note.title.length > 15
                  ? note.title.slice(0, 15) + "…"
                  : note.title}
                <div className="icons-wrapper">
                  <FontAwesomeIcon
                    icon={faArrowDown}
                    className="note-sidebar-icon"
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  />
                  <FontAwesomeIcon
                    icon={faEllipsis}
                    className="note-sidebar-icon"
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  />
                  <FontAwesomeIcon
                    className="note-sidebar-icon"
                    icon={faPlus}
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  />
                </div>
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
        <header className="header-notes-container">
          <h2 className="header-notes-title">
            {noteTitle.length > 25 ? noteTitle.slice(0, 25) + "…" : noteTitle}
          </h2>
          <div className="header-note-icons">
            <FontAwesomeIcon icon={faClockRotateLeft} />
            <FontAwesomeIcon
              icon={isFavorite ? faStarSolid : faStarRegular}
              onClick={toggleFavorite}
              style={{ cursor: "pointer", color: isFavorite ? "gold" : "gray" }}
            />
          </div>
        </header>
        <main className="main-notes-container">
          <Outlet context={{ fetchNotes }} />
        </main>
      </div>
    </div>
  );
}
