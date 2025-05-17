import { useEffect, useState } from "react";

import "./App.css";
import { ItemList } from "./components/ItemList";

function App() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(search);

  const [total, setTotal] = useState(0);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);

    return () => clearTimeout(timeout);
  }, [search]);

  return (
    <div className="container">
      <div className="inputContainer">
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
        {/* <button>Найти</button> */}
      </div>
      <p>Всего: {total} элементов</p>
      <ItemList search={debouncedSearch} setTotal={setTotal} />
    </div>
  );
}

export default App;
