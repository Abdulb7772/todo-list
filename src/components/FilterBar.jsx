import React from "react";

export default function FilterBar({ filter, setFilter, search, setSearch, visibleCount }) {
  return (
    <div className="filter-container" style={{ display: "flex", gap: 12, alignItems: "center", justifyContent: "space-between", flexWrap: "wrap" }}>
      <div className="filters" role="tablist" aria-label="Filter todos">
        <button className={`small ${filter === "all" ? "filter-active" : ""}`} onClick={() => setFilter("all")} aria-pressed={filter === "all"}>All</button>
        <button className={`small ${filter === "active" ? "filter-active" : ""}`} onClick={() => setFilter("active")} aria-pressed={filter === "active"}>Active</button>
        <button className={`small ${filter === "completed" ? "filter-active" : ""}`} onClick={() => setFilter("completed")} aria-pressed={filter === "completed"}>Completed</button>
      </div>

      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <input
          className="input"
          style={{ width: 200, margin: 0 }}
          placeholder="Search title, tags..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Search todos"
        />
        <div style={{ fontSize: 13, color: "var(--muted)", fontWeight: 600, minWidth: 20 }}>{visibleCount}</div>
      </div>
    </div>
  );
}
