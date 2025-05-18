import express from "express";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());

const ITEMS = Array.from({ length: 1000000 }, (_, i) => (i + 1).toString());

const selected = new Set();

app.get("/items", (req, res) => {
  const { search = "", offset = 0, limit = 20 } = req.query;

  const filtered = ITEMS.filter((item) => item.includes(search));

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
  const { items } = req.body;
  if (!Array.isArray(items)) {
    return res.status(400).json({ error: "Invalid request" });
  }
  const sortedItems = items.slice().sort((a, b) => Number(a) - Number(b));
  for (let i = 0; i < sortedItems.length; i++) {
    const index = ITEMS.lastIndexOf(sortedItems[i]);
    ITEMS[index] = items[i];
  }
  res.json({ status: "ok" });
});

app.post("/select", (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ error: "Invalid request" });
  }

  selected.add(id);

  res.json({ status: "ok" });
});

app.listen(8880, () => console.log("server running"));
