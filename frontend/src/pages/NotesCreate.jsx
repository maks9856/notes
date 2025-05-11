import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../api";
import { ACCESS_TOKEN } from "../constants";
import { useOutletContext } from "react-router-dom";
export default function NotesCreate() {
  const { fetchNotes } = useOutletContext();
  const { uuid } = useParams();
  const [note, setNote] = useState({ title: "", content: "" });
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    if (!uuid) return;

    const currentStorageKey = `note_exists_${uuid}`;
    const allKeys = Object.keys(localStorage).filter(key => key.startsWith('note_exists_'));
    const previousKey = allKeys.find(key => key !== currentStorageKey);
     const deleteOldNote = async () => {
      if (previousKey) {
        localStorage.removeItem(previousKey);
      }
    };
    const noteExists = localStorage.getItem(currentStorageKey);

    if (noteExists) {
      api.get(`/notes-api/notes/${uuid}/`, {
        headers: {
          'Authorization': `Bearer ${ACCESS_TOKEN}`
        }
      }).then((res) => {
        setNote(res.data);
        setLoading(true);
      }).catch(() => {
      });
    } else {
      deleteOldNote().then(()=>{ api.post('/notes-api/notes/', {
            title: '',
            content: '',
            uuid
          }, {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${ACCESS_TOKEN}`
            }
          }).then((res) => {
            setNote(res.data);
            setLoading(true);
            fetchNotes();
            noteExists=localStorage.setItem(`note_exists_${uuid}`,'true');
          }).catch(() => {
          });}) 
    }
  }, [uuid]);

  useEffect(() => {
  if (!loading) return;

  const timeout = setTimeout(() => {
    api.put(`/notes-api/notes/${uuid}/`, note, {
      headers: {
        'Authorization': `Bearer ${ACCESS_TOKEN}`
      }
    })
    .then(() => fetchNotes())
    .catch(() => {});
  }, 500);

  return () => clearTimeout(timeout);
}, [note.title, note.content, uuid, loading]);


  useEffect(() => {

    const previousTitle = document.title;
    document.title = note.title || 'Нова нотатка';
    return () => {
      document.title = previousTitle;
    };
  }, [note.title]);


  if (!loading) return <p>Завантаження...</p>;

  return (
    <>
      <input
        value={note.title}
        onChange={(e) => setNote({ ...note, title: e.target.value })}
      />
      <textarea
        value={note.content}
        onChange={(e) => setNote({ ...note, content: e.target.value })}
      />
    </>
  );
}
