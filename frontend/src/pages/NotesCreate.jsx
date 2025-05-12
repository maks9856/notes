import { useState, useEffect,useRef } from "react";
import { useParams } from "react-router-dom";
import api from "../api";
import { ACCESS_TOKEN } from "../constants";
import { useOutletContext } from "react-router-dom";
import '../styles/NotesCreate.css';
export default function NotesCreate() {
  const { fetchNotes } = useOutletContext();
  const { uuid } = useParams();
  const [note, setNote] = useState({ title: "", content: "" });
  const [loading, setLoading] = useState(false);
  const titleRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(()=>{
    if(!uuid)return;
    api.post(`/notes-api/notes/${uuid}/`,{...note,title:note.title|| 'Нова нотатка',},{
        headers: { Authorization: `Bearer ${ACCESS_TOKEN}` },
      }).then((res) => {
        setNote(res.data);
        setLoading(true);
        fetchNotes();
      })
      .catch((err) => {
        console.error("Помилка завантаження нотатки:", err);
      });
  },[uuid])

  useEffect(() => {
    if (!loading) return;

    const prevTitle = document.title;
    document.title = note.title || 'Нова нотатка';

    const timeout = setTimeout(() => {
      api.put(`/notes-api/notes/${uuid}/`, {
        ...note,
        title: note.title || 'Нова нотатка',
      }, {
        headers: {
          'Authorization': `Bearer ${ACCESS_TOKEN}`
        }
      })
      .then(() => fetchNotes())
      .catch(() => {});
    }, 500);

    return () => {
      clearTimeout(timeout);
      document.title = prevTitle;
    };
  }, [note.title, note.content, uuid, loading]);

  useEffect(() => {
  if (titleRef.current) {
    titleRef.current.style.height = "auto";
    titleRef.current.style.height = `${titleRef.current.scrollHeight}px`;
  }

  if (contentRef.current) {
    contentRef.current.style.height = "auto";
    contentRef.current.style.height = `${contentRef.current.scrollHeight}px`;
  }
}, [note.title, note.content]);

  if (!loading) return <p>Завантаження...</p>;

  return (
    <div className="notes-create-container">
      
      <textarea
        className="note-title"
        ref={titleRef}
        value={note.title}
        onChange={(e) => {
          setNote({ ...note, title: e.target.value });

          e.target.style.height = 'auto'; // Скидання
          e.target.style.height = `${e.target.scrollHeight}px`;
        }}
        placeholder="Заголовок"
        rows={1}
        />

      
      <textarea
        className="note-content"
        ref={contentRef}
        value={note.content}
        onChange={(e) => {
          setNote(
            { ...note, content: e.target.value })
            e.target.style.height = 'auto';
            e.target.style.height = `${e.target.scrollHeight}px`;
            }}
        placeholder="Текст нотатки"
      />
     
    </div>
  );
}
