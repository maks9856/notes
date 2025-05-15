import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { useOutletContext } from "react-router-dom";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import api from "../api";
import { ACCESS_TOKEN } from "../constants";
import "../styles/NotesCreate.css";
import "../styles/Tiptap.css"
export default function NotesCreate() {
  const { fetchNotes } = useOutletContext();
  const { uuid } = useParams();
  const [note, setNote] = useState({ title: "", content: "" });
  const [loading, setLoading] = useState(false);
  const titleRef = useRef(null);

  const editor = useEditor({
    extensions: [StarterKit],
    content: note.content || '',
    onUpdate: ({ editor }) => {
      setNote(prev => ({ ...prev, content: editor.getHTML() }));
    },
  });

  useEffect(() => {
    if (!uuid) return;

    api
      .post(`/notes-api/notes/${uuid}/`, {
        ...note,
        title: note.title || "Нова нотатка",
      }, {
        headers: { Authorization: `Bearer ${ACCESS_TOKEN}` },
      })
      .then((res) => {
        setNote(res.data);
        setLoading(true);
        fetchNotes();
      })
      .catch((err) => {
        console.error("Помилка завантаження нотатки:", err);
      });
  }, [uuid]);

  useEffect(() => {
    if (!loading) return;

    const prevTitle = document.title;
    document.title = note.title || "Нова нотатка";

    const timeout = setTimeout(() => {
      api
        .put(`/notes-api/notes/${uuid}/`, {
          ...note,
          title: note.title || "Нова нотатка",
        }, {
          headers: {
            Authorization: `Bearer ${ACCESS_TOKEN}`,
          },
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
    if (editor && note.content !== editor.getHTML()) {
      editor.commands.setContent(note.content || '');
    }
  }, [note.content, uuid, editor]);

  if (!loading) return <p>Завантаження...</p>;

  return (
    <div className="notes-create-container hide-scrollbar ">
      <textarea
        className="note-title hide-scrollbar "
        ref={titleRef}
        value={note.title}
        onChange={(e) =>
          setNote({ ...note, title: e.target.value })
        }
        placeholder="Заголовок"
        rows={1}
      />
      <EditorContent editor={editor} className="note-content" />
    </div>
  );
}
