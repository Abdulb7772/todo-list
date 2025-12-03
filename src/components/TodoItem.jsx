import React, { useState, useRef, useEffect } from "react";
import SubtasksModal from "./SubtasksModal";

/* small util */
const formatDate = (iso) => {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleDateString();
};

/* Predefined tag options */
const TAG_OPTIONS = [
  "Work",
  "Personal",
  "Urgent",
  "Shopping",
  "Health",
  "Finance",
  "Family",
  "Study",
  "Project",
  "Meeting"
];

export default function TodoItem({ todo, onToggle, onSave, onDelete }) {
  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split("T")[0];
  
  const [editing, setEditing] = useState(false);
  const [showSubtasks, setShowSubtasks] = useState(false);
  const [form, setForm] = useState({
    title: todo.title,
    description: todo.description || "",
    dueDate: todo.dueDate || "",
    priority: todo.priority || "important",
    selectedTags: todo.tags || [],
  });
  const inputRef = useRef(null);

  useEffect(() => {
    if (editing && inputRef.current) inputRef.current.focus();
  }, [editing]);

  useEffect(() => {
    // keep local form synced if todo changes externally
    setForm({
      title: todo.title,
      description: todo.description || "",
      dueDate: todo.dueDate || "",
      priority: todo.priority || "important",
      selectedTags: todo.tags || [],
    });
  }, [todo]);

  const addTag = (tag) => {
    if (tag && !form.selectedTags.includes(tag)) {
      setForm((s) => ({ ...s, selectedTags: [...s.selectedTags, tag] }));
    }
  };

  const removeTag = (tagToRemove) => {
    setForm((s) => ({ ...s, selectedTags: s.selectedTags.filter(tag => tag !== tagToRemove) }));
  };

  const handleUpdateSubtasks = (subtasks) => {
    onSave({ subtasks });
  };

  const save = () => {
    if (!form.title.trim()) {
      alert("Title required");
      return;
    }
    else if(form.title.length<3) {
        alert("Title must be at least 3 characters long");
        return;
    }
    else if(form.title.length>20){
        alert("Title must be at most not be longer then 20 characters");
        return;
    }
    onSave({
      title: form.title.trim(),
      description: form.description.trim(),
      dueDate: form.dueDate || null,
      priority: form.priority,
      tags: form.selectedTags,
    });
    setEditing(false);
  };

  const onKey = (e) => {
    if (e.key === "Enter") save();
    if (e.key === "Escape") {
      setForm({
        title: todo.title,
        description: todo.description || "",
        dueDate: todo.dueDate || "",
        priority: todo.priority || "important",
        selectedTags: todo.tags || [],
      });
      setEditing(false);
    }
  };

  const isOverdue = todo.dueDate ? new Date(todo.dueDate) < new Date() && !todo.completed : false;

  return (
    <div className={`todo-card ${todo.completed ? "completed" : ""}`} role="listitem" aria-label={`Todo ${todo.title}`}>
      <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
        <div style={{ display: "flex", gap: 12 }}>
          <div style={{ flex: 1 }}>
            {!editing ? (
              <div onDoubleClick={() => setEditing(true)} style={{ cursor: "pointer" }} tabIndex={0} onKeyDown={(e) => { if (e.key === "Enter") setEditing(true) }}>
                <div style={{ fontWeight: 800, fontSize: 16 }}>{todo.title}</div>
                <div className="todo-meta">{todo.description}</div>
                <div className="todo-meta">
                  <span style={{ marginRight: 8 }}>{todo.createdAt ? new Date(todo.createdAt).toLocaleString() : ""}</span>
                  {todo.dueDate && <span style={{ marginRight: 8 }}>Due: {formatDate(todo.dueDate)}</span>}
                  <span style={{ marginRight: 8 }}>Priority: <strong>{todo.priority}</strong></span>
</div>

{/* --- Subtask Display --- */}
{todo.subtasks && todo.subtasks.length > 0 && (
  <div style={{ marginTop: 10 }}>
    <h4 style={{ marginBottom: 6, fontSize: 14, fontWeight: 700 }}>Subtasks:</h4>
    <ul style={{ paddingLeft: 20, margin: 0 }}>
      {todo.subtasks.map((sub) => (
        <li key={sub.id} style={{ marginBottom: 4 }}>
          {/* <input type="checkbox" checked={sub.completed} readOnly style={{ marginRight: 6 }} /> */}
          <span style={{ textDecoration: sub.completed ? "line-through" : "none", color: sub.completed ? "#6b7280" : "inherit" }}>
            {sub.title}
          </span>
        </li>
      ))}
    </ul>
  </div>
)}
<div className="tags" aria-hidden>
                  {(todo.tags || []).map((tg) => <div key={tg} className="tag">{tg}</div>)}
                </div>
              </div>
            ) : (
              <div onKeyDown={onKey}>
                <input ref={inputRef} className="input" value={form.title} onChange={(e) => setForm((s) => ({ ...s, title: e.target.value }))} />
                <div style={{ height: 8 }} />
                <input 
                  className="input" 
                  value={form.dueDate} 
                  type="date" 
                  min={today}
                  onChange={(e) => setForm((s) => ({ ...s, dueDate: e.target.value }))} 
                />
                <div style={{ height: 8 }} />
                <select className="select" value={form.priority} onChange={(e) => setForm((s) => ({ ...s, priority: e.target.value }))}>
                  <option value="important">Important</option>
                  <option value="critical">Critical</option>
                  <option value="most-important">Most Important</option>
                </select>
                <div style={{ height: 8 }} />
                <select 
                  className="select" 
                  onChange={(e) => {
                    if (e.target.value) {
                      addTag(e.target.value);
                      e.target.value = "";
                    }
                  }}
                  defaultValue=""
                >
                  <option value="">Select tags...</option>
                  {TAG_OPTIONS.map((tag) => (
                    <option key={tag} value={tag}>{tag}</option>
                  ))}
                </select>
                {form.selectedTags.length > 0 && (
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 8 }}>
                    {form.selectedTags.map((tag) => (
                      <div key={tag} className="tag" style={{ display: "flex", alignItems: "center", gap: 4, cursor: "pointer" }} onClick={() => removeTag(tag)}>
                        {tag}
                        <span style={{ fontWeight: "bold", marginLeft: 2 }}>×</span>
                      </div>
                    ))}
                  </div>
                )}
                <div style={{ height: 8 }} />
                <textarea className="textarea" value={form.description} onChange={(e) => setForm((s) => ({ ...s, description: e.target.value }))} />
                <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                  <button className="btn btn-primary" onClick={save}>Save</button>
                  <button className="btn btn-ghost" onClick={() => { setEditing(false); setForm({
                    title: todo.title,
                    description: todo.description || "",
                    dueDate: todo.dueDate || "",
                    priority: todo.priority || "important",
                    selectedTags: todo.tags || [],
                  }) }}>Cancel</button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="controls">
          <button className={`small ${todo.completed ? "btn-undone" : "btn-done"}`} onClick={onToggle} aria-label={todo.completed ? `Mark ${todo.title} as undone` : `Mark ${todo.title} as done`}>
            {todo.completed ? "Mark as Undone" : "Mark as Done"}
          </button>
          <button className="small btn-edit" onClick={() => { setEditing(true); }}>Edit</button>
          <button className="small btn-delete" onClick={onDelete} aria-label={`Delete ${todo.title}`}>Delete</button>
          <div style={{ marginLeft: "auto", display: "flex", gap: 8, alignItems: "center" }}>
            <div className={`badge ${todo.priority === "important" ? "badge-important" : todo.priority === "critical" ? "badge-critical" : "badge-most-important"}`}>{todo.priority}</div>
            {todo.dueDate && <div style={{ fontSize: 13, color: isOverdue ? "var(--danger)" : "var(--muted)" }}>{isOverdue ? "Overdue" : `Due ${formatDate(todo.dueDate)}`}</div>}
          </div>
        </div>
      </div>
      <button 
        className="add-subtasks-btn" 
        onClick={() => setShowSubtasks(true)} 
        aria-label="Add subtasks"
        title={`Add subtasks${todo.subtasks && todo.subtasks.length > 0 ? ` (${todo.subtasks.length})` : ''}`}
      >
        +
      </button>
      {showSubtasks && (
        <SubtasksModal
          todo={todo}
          onClose={() => setShowSubtasks(false)}
          onUpdateSubtasks={handleUpdateSubtasks} 
        />
        
      )}
    </div>
  );
}
