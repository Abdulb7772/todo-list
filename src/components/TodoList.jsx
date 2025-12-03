import React from "react";
import TodoItem from "./TodoItem";

export default function TodoList({ todos, onToggle, onUpdate, onDelete }) {
  if (!todos.length) {
    return <div style={{ textAlign: "center", padding: "40px 16px", color: "var(--muted)" }}>No todo list's to show</div>;
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <div style={{ fontSize: 16, fontWeight: 700 }}>Todo List</div>
        <div style={{ fontSize: 13, color: "var(--muted)" }}>{todos.length} items</div>
      </div>

      <div className="todo-list" role="list">
        {todos.map((todo) => (
          <TodoItem key={todo.id} todo={todo} onToggle={() => onToggle(todo.id)} onSave={(updates) => onUpdate(todo.id, updates)} onDelete={() => onDelete(todo.id)} />
        ))}
      </div>
    </div>
  );
}
