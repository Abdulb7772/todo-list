import React, { useEffect, useReducer, useState } from "react";
import TodoForm from "./components/TodoFOrm";
import TodoList from "./components/TodoList";
import FilterBar from "./components/FilterBar";

/* Local storage key */
const STORAGE_KEY = "todos_v1";

/* Reducer actions:
  ADD, UPDATE, DELETE, TOGGLE, CLEAR_COMPLETED, TOGGLE_ALL, INIT
*/
function reducer(state, action) {
  switch (action.type) {
    case "INIT":
      return action.payload || [];
    case "ADD":
      return [action.payload, ...state];
    case "UPDATE":
      return state.map((t) => (t.id === action.payload.id ? { ...t, ...action.payload.updates } : t));
    case "DELETE":
      return state.filter((t) => t.id !== action.payload);
    case "TOGGLE":
      return state.map((t) => (t.id === action.payload ? { ...t, completed: !t.completed } : t));
    case "CLEAR_COMPLETED":
      return state.filter((t) => !t.completed);
    case "TOGGLE_ALL":
      return state.map((t) => ({ ...t, completed: action.payload }));
    default:
      return state;
  }
}

export default function App() {
  const [todos, dispatch] = useReducer(reducer, []);
  const [filter, setFilter] = useState("all"); // all | active | completed
  const [search, setSearch] = useState("");

  // load from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        dispatch({ type: "INIT", payload: JSON.parse(raw) });
      }
    } catch (e) {
      console.error("Failed to load todos", e);
    }
  }, []);

  // persist to localStorage whenever todos change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  }, [todos]);

  // helpers
  const addTodo = (todo) => {
    dispatch({ type: "ADD", payload: todo });
  };

  const updateTodo = (id, updates) => {
    dispatch({ type: "UPDATE", payload: { id, updates } });
  };

  const deleteTodo = (id) => {
    dispatch({ type: "DELETE", payload: id });
  };

  const toggleTodo = (id) => {
    dispatch({ type: "TOGGLE", payload: id });
  };

  const clearCompleted = () => {
    dispatch({ type: "CLEAR_COMPLETED" });
  };

  const toggleAll = (value) => {
    dispatch({ type: "TOGGLE_ALL", payload: value });
  };

  // derived
  const itemsLeft = todos.filter((t) => !t.completed).length;

  // filtering and searching
  const visibleTodos = todos.filter((t) => {
    if (filter === "active" && t.completed) return false;
    if (filter === "completed" && !t.completed) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      if (!(t.title.toLowerCase().includes(q) || (t.description || "").toLowerCase().includes(q) || (t.tags || []).join(" ").toLowerCase().includes(q))) {
        return false;
      }
    }
    return true;
  });

  return (
    <div className="app" role="application" aria-label="Todo application">
      <aside className="panel" aria-label="Controls">
        <div className="header">
          <div>
            <div className="title">Todo List</div>
            {/* <div className="todo-meta">Build: add/edit/delete, filters, persistence</div> */}
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 14, color: "var(--muted)", fontWeight:700 }}>{itemsLeft} items left</div>
          </div>
        </div>

        <TodoForm
          onAdd={(payload) => {
            const now = Date.now();
            addTodo({
              id: `t_${now}`,
              title: payload.title,
              description: payload.description || "",
              dueDate: payload.dueDate || null,
              priority: payload.priority || "low",
              tags: payload.tags || [],
              subtasks: [],
              createdAt: new Date(now).toISOString(),
              completed: false,
            });
          }}
        />

        <div style={{ marginTop: 12 }}>          <div style={{ marginTop: 10, display: "flex", gap: 8, flexWrap: "wrap" }}>
            <button className="small btn-action" onClick={() => toggleAll(true)} aria-label="Mark all done">Mark all done</button>
            <button className="small btn-action" onClick={() => toggleAll(false)} aria-label="Mark all undone">Mark all undone</button>
            <button className="small btn-delete" onClick={() => { if (confirm("Clear all completed todos?")) clearCompleted(); }} aria-label="Clear completed">Clear completed</button>
          </div>
        </div>
      </aside>

      <main className="main" aria-live="polite">
        <FilterBar filter={filter} setFilter={setFilter} search={search} setSearch={setSearch} visibleCount={visibleTodos.length} />
        <TodoList
          todos={visibleTodos}
          onToggle={toggleTodo}
          onUpdate={updateTodo}
          onDelete={(id) => {
            if (confirm("Delete this todo?")) deleteTodo(id);
          }}
        />
      </main>
    </div>
  );
}
