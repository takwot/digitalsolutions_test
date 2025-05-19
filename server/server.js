import express from "express";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());

let ITEMS = Array.from({ length: 1000000 }, (_, i) => (i + 1).toString());

const selected = new Set();

app.get("/items", (req, res) => {
  const { search = "", offset = 0, limit = 20 } = req.query;

  const filtered = search
    ? ITEMS.filter((item) => item.includes(search.toString()))
    : ITEMS;

  const paginated = filtered.slice(
    Number(offset),
    Number(offset) + Number(limit)
  );

  res.json({
    items: paginated,
    total: filtered.length,
    selected: Array.from(selected),
  });
});

app.post("/order", (req, res) => {
  const { items, offset, search = "" } = req.body;

  // Need to fix

  const filtered = search
    ? ITEMS.filter((item) => item.includes(search.toString()))
    : ITEMS;

  const paginated = filtered.slice(0, Number(offset));

  paginated.map((el, i) => {
    if (el !== items[i]) {
      const index = ITEMS.lastIndexOf(el);
      ITEMS[index] = items[i];
    }
  });

  res.json({ status: "ok" });
});

app.post("/select", (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ error: "Invalid request" });
  }

  if (selected.has(id)) {
    selected.delete(id);
  } else {
    selected.add(id);
  }

  res.json({ status: "ok" });
});

app.listen(8880, () => console.log("server running"));
