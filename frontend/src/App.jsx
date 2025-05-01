// src/App.jsx
import React, { useState } from "react";

import "./App.css";
import { ItemList } from "./ItemList";

function App() {
  const [search, setSearch] = useState("");

  const [total, setTotal] = useState(0);

  return (
    <div className="container">
      <input
        className="search"
        type="text"
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setOffset(0);
        }}
        placeholder="Поиск..."
      />
      <p>Всего: {total} элементов</p>
      <ItemList search={search} setTotal={setTotal} />
    </div>
  );
}

export default App;
