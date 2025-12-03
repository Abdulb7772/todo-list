import React, { useState, useRef, useEffect } from "react";

export default function SubtasksModal({ todo, onClose, onUpdateSubtasks }) {
  const [subtasks, setSubtasks] = useState(todo.subtasks || []);
  const [newSubtask, setNewSubtask] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    if (editingId && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editingId]);

  const addSubtask = () => {
    if (newSubtask.trim()) {
      const subtask = {
        id: `st_${Date.now()}`,
        title: newSubtask.trim(),
        completed: false,
      };
      const updated = [...subtasks, subtask];
      setSubtasks(updated);
      setNewSubtask("");
      onUpdateSubtasks(updated);
    }
  };

  const toggleSubtask = (id) => {
    const updated = subtasks.map((st) =>
      st.id === id ? { ...st, completed: !st.completed } : st
    );
    setSubtasks(updated);
    onUpdateSubtasks(updated);
  };

  const deleteSubtask = (id) => {
    const updated = subtasks.filter((st) => st.id !== id);
    setSubtasks(updated);
    onUpdateSubtasks(updated);
  };

  const startEdit = (subtask) => {
    setEditingId(subtask.id);
    setEditText(subtask.title);
  };

  const saveEdit = (id) => {
    if (editText.trim()) {
      const updated = subtasks.map((st) =>
        st.id === id ? { ...st, title: editText.trim() } : st
      );
      setSubtasks(updated);
      onUpdateSubtasks(updated);
    }
    setEditingId(null);
    setEditText("");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditText("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      addSubtask();
    }
  };

  const handleEditKeyPress = (e, id) => {
    if (e.key === "Enter") {
      saveEdit(id);
    } else if (e.key === "Escape") {
      cancelEdit();
    }
  };

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
          maxWidth: 600,
          width: "90%",
          maxHeight: "80vh",
          overflow: "auto",
          boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: "var(--accent)" }}>
            Subtasks for: {todo.title}
          </h2>
          <button
            className="small"
            onClick={onClose}
            style={{ fontSize: 24, padding: "4px 12px", lineHeight: 1 }}
          >
            ×
          </button>
        </div>

        <div style={{ marginBottom: 20 }}>
          <div style={{ display: "flex", gap: 8 }}>
            <input
              className="input"
              placeholder="Add a new subtask..."
              value={newSubtask}
              onChange={(e) => setNewSubtask(e.target.value)}
              onKeyPress={handleKeyPress}
              style={{ flex: 1 }}
            />
            <button className="btn btn-primary" onClick={addSubtask}>
              Add
            </button>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {subtasks.length === 0 ? (
            <div style={{ textAlign: "center", padding: 40, color: "var(--muted)" }}>
              No subtasks yet. Add one above!
            </div>
          ) : (
            subtasks.map((subtask) => (
              <div
                key={subtask.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: 12,
                  background: subtask.completed ? "#f0fdf4" : "#f9fafb",
                  borderRadius: 8,
                  border: "1px solid",
                  borderColor: subtask.completed ? "#bbf7d0" : "#e5e7eb",
                }}
              >
                {editingId === subtask.id ? (
                  <>
                    <input
                      ref={inputRef}
                      className="input"
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      onKeyDown={(e) => handleEditKeyPress(e, subtask.id)}
                      style={{ flex: 1, margin: 0 }}
                    />
                    <button
                      className="small btn-ghost"
                      onClick={() => saveEdit(subtask.id)}
                      style={{ padding: "4px 8px", fontSize: 12 }}
                    >
                      Save
                    </button>
                    <button
                      className="small btn-ghost"
                      onClick={cancelEdit}
                      style={{ padding: "4px 8px", fontSize: 12 }}
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <input
                      type="checkbox"
                      checked={subtask.completed}
                      onChange={() => toggleSubtask(subtask.id)}
                      style={{ width: 18, height: 18, cursor: "pointer" }}
                    />
                    <div
                      style={{
                        flex: 1,
                        textDecoration: subtask.completed ? "line-through" : "none",
                        color: subtask.completed ? "#6b7280" : "#111827",
                        fontWeight: 600,
                      }}
                    >
                      {subtask.title}
                    </div>
                    <button
                      className="small btn-edit"
                      onClick={() => startEdit(subtask)}
                      style={{ padding: "4px 8px", fontSize: 12 }}
                    >
                      Edit
                    </button>
                    <button
                      className="small btn-delete"
                      onClick={() => deleteSubtask(subtask.id)}
                      style={{ padding: "4px 8px", fontSize: 12 }}
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>
            ))
          )}
        </div>

        {subtasks.length > 0 && (
          <div style={{ marginTop: 16, fontSize: 13, color: "var(--muted)", fontWeight: 600 }}>
            {subtasks.filter((st) => st.completed).length} of {subtasks.length} completed
          </div>
        )}
      </div>
    </div>
  );
}
