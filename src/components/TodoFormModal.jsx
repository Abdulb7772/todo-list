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

export default function TodoFormModal({ onAdd, onClose }) {
  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split("T")[0];
  
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
    
    if (title.trim().length < 3) {
      setError("Title must be at least 3 characters long");
      return;
    }
    
    if (title.trim().length > 20) {
      setError("Title must not be longer than 20 characters");
      return;
    }

    if (!isValidDateString(dueDate)) {
      setError("Please enter a valid due date.");
      return;
    }

    onAdd({ title: title.trim(), description: description.trim(), dueDate: dueDate || null, priority, tags: selectedTags });
    reset();
    onClose();
  }

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "var(--card)",
          borderRadius: 12,
          padding: 24,
          maxWidth: 500,
          width: "90%",
          maxHeight: "80vh",
          overflow: "auto",
          boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: "var(--accent)" }}>
            Add New Todo
          </h2>
          <button
            className="small"
            onClick={onClose}
            style={{ fontSize: 24, padding: "4px 12px", lineHeight: 1 }}
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} aria-label="Add todo form">
          <div style={{ marginBottom: 12 }}>
            <input
              aria-label="Todo title"
              placeholder="Title (required)"
              className="input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              autoFocus
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
              min={today}
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
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 12 }}>
              {selectedTags.map((tag) => (
                <div key={tag} className="tag" style={{ display: "flex", alignItems: "center", gap: 4, cursor: "pointer" }} onClick={() => removeTag(tag)}>
                  {tag}
                  <span style={{ fontWeight: "bold", marginLeft: 2 }}>×</span>
                </div>
              ))}
            </div>
          )}

          {error && <div style={{ color: "var(--danger)", marginBottom: 12, fontSize: 14 }}>{error}</div>}

          <div style={{ display: "flex", gap: 8 }}>
            <button type="submit" className="btn btn-primary" aria-label="Add todo">Add Todo</button>
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}
