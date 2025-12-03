import React, { useEffect, useReducer, useState } from "react";
import TodoForm from "./components/TodoFOrm";
import TodoFormModal from "./components/TodoFormModal";
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
  const [showAddModal, setShowAddModal] = useState(false);

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
      {/* Add Todo Button at the bottom right */}
      <div style={{ position: "fixed", bottom: 30, right: 30, zIndex: 100 }}>
        <button 
          className="btn btn-primary" 
          onClick={() => setShowAddModal(true)}
          style={{ fontSize: 16, padding: "12px 24px", boxShadow: "0 4px 12px rgba(37,99,235,0.3)" }}
        >
          + Add new Todo
        </button>
      </div>

      {/* Todo Form Modal */}
      {showAddModal && (
        <TodoFormModal
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
          onClose={() => setShowAddModal(false)}
        />
      )}

      <main className="main" aria-live="polite" style={{ maxWidth: 1200, margin: "0 auto" }}>
        <FilterBar 
          filter={filter} 
          setFilter={setFilter} 
          search={search} 
          setSearch={setSearch} 
          visibleCount={visibleTodos.length}
          toggleAll={toggleAll}
          clearCompleted={clearCompleted}
        />
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
