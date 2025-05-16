import { useState, useEffect, useRef } from "react";
import { useParams, useOutletContext } from "react-router-dom";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import api from "../api";
import { ACCESS_TOKEN } from "../constants";
import "../styles/NotesCreate.css";
import "../styles/Tiptap.css";

export default function NotesCreate() {
  const { fetchNotes } = useOutletContext();
  const { uuid } = useParams();

  const [note, setNote] = useState({ title: "", content: "" });
  const [loading, setLoading] = useState(false);
  const [slashCommandOpen, setSlashCommandOpen] = useState(false);
  const [slashCommandPosition, setSlashCommandPosition] = useState({ x: 0, y: 0 });

  const titleRef = useRef(null);

  const editor = useEditor({
    extensions: [StarterKit],
    content: note.content || "",
    onUpdate: ({ editor }) => {
      setNote(prev => ({ ...prev, content: editor.getHTML() }));
    },
    onCreate: ({ editor }) => {
      editor.view.dom.addEventListener("keydown", event => {
        if (event.key === "/") {
          const { from } = editor.state.selection;
          const coords = editor.view.coordsAtPos(from);
          const editorRect = editor.view.dom.parentElement.getBoundingClientRect();

          setSlashCommandPosition({
            x: coords.left - editorRect.left,
            y: coords.bottom - editorRect.top+30,
          });

          setSlashCommandOpen(true);
        } else {
          setSlashCommandOpen(false);
        }
      });
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
      .then(res => {
        setNote(res.data);
        setLoading(true);
        fetchNotes();
      })
      .catch(err => console.error("Помилка завантаження нотатки:", err));
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
          headers: { Authorization: `Bearer ${ACCESS_TOKEN}` },
        })
        .then(fetchNotes)
        .catch(() => {});
    }, 500);

    return () => {
      clearTimeout(timeout);
      document.title = prevTitle;
    };
  }, [note.title, note.content, uuid, loading]);

  useEffect(() => {
    if (editor && note.content !== editor.getHTML()) {
      editor.commands.setContent(note.content || "");
    }
  }, [note.content, uuid, editor]);

  const insertCommand = type => {
    if (!editor) return;

    switch (type) {
      case "Заголовок":
        editor.commands.setNode("heading", { level: 2 });
        break;
      case "Список":
        editor.commands.toggleBulletList();
        break;
      case "Цитата":
        editor.commands.setBlockquote();
        break;
      default:
        break;
    }

    setSlashCommandOpen(false);
  };

  if (!loading) return <p>Завантаження...</p>;

  return (
    <div className="notes-create-container hide-scrollbar">
      <textarea
        ref={titleRef}
        className="note-title hide-scrollbar"
        value={note.title}
        onChange={e => setNote({ ...note, title: e.target.value })}
        placeholder="Заголовок"
        rows={1}
      />

      <div className="note-content">
        <EditorContent editor={editor} className="note-editor" />

        {slashCommandOpen && (
          <div
            className="slash-menu"
            style={{
              position: "absolute",
              left: slashCommandPosition.x,
              top: slashCommandPosition.y,
            }}
          >
            <div onClick={() => insertCommand("Заголовок")}>Заголовок</div>
            <div onClick={() => insertCommand("Список")}>Список</div>
            <div onClick={() => insertCommand("Цитата")}>Цитата</div>
          </div>
        )}
      </div>
    </div>
  );
}
