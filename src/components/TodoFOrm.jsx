import React, { useState } from "react";

/* small helper */
function isValidDateString(s) {
  if (!s) return true;
  const d = new Date(s);
  return !Number.isNaN(d.getTime());
}

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

export default function TodoForm({ onAdd }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("important");
  const [selectedTags, setSelectedTags] = useState([]);
  const [error, setError] = useState("");

  function reset() {
    setTitle("");
    setDescription("");
    setDueDate("");
    setPriority("important");
    setSelectedTags([]);
    setError("");
  }

  const addTag = (tag) => {
    if (tag && !selectedTags.includes(tag)) {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const removeTag = (tagToRemove) => {
    setSelectedTags(selectedTags.filter(tag => tag !== tagToRemove));
  };

  function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!title.trim()) {
      setError("Title is required.");
      return;
    }

    if (!isValidDateString(dueDate)) {
      setError("Please enter a valid due date.");
      return;
    }

    onAdd({ title: title.trim(), description: description.trim(), dueDate: dueDate || null, priority, tags: selectedTags });
    reset();
  }

  return (
    <form onSubmit={handleSubmit} aria-label="Add todo form">
      <div style={{ marginBottom: 12 }}>
        <input
          aria-label="Todo title"
          placeholder="Title (required)"
          className="input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div style={{ marginBottom: 12 }}>
        <textarea
          aria-label="Description"
          placeholder="Description (optional)"
          className="textarea"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div className="form-row">
        <input
          aria-label="Todo due date"
          type="date"
          className="input"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
        <select aria-label="Priority" className="select" value={priority} onChange={(e) => setPriority(e.target.value)}>
          <option value="important">Important</option>
          <option value="critical">Critical</option>
          <option value="most-important">Most Important</option>
        </select>
      </div>

      <div className="form-row">
        <select 
          aria-label="Tags" 
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
      </div>

      {selectedTags.length > 0 && (
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 8 }}>
          {selectedTags.map((tag) => (
            <div key={tag} className="tag" style={{ display: "flex", alignItems: "center", gap: 4, cursor: "pointer" }} onClick={() => removeTag(tag)}>
              {tag}
              <span style={{ fontWeight: "bold", marginLeft: 2 }}>×</span>
            </div>
          ))}
        </div>
      )}

      {error && <div style={{ color: "var(--danger)", marginBottom: 8 }}>{error}</div>}

      <div style={{ display: "flex", gap: 8 }}>
        <button type="submit" className="btn btn-primary" aria-label="Add todo">Add Todo List</button>
        <button type="button" className="btn btn-ghost" onClick={() => { setTitle(""); setDescription(""); setDueDate(""); setSelectedTags([]); }}>Reset</button>
      </div>
    </form>
  );
}
