import express from "express";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());

const ITEMS = Array.from({ length: 1000000 }, (_, i) => (i + 1).toString());

const userState = {};

app.get("/items", (req, res) => {
  const { userId, search = "", offset = 0, limit = 20 } = req.query;

  if (!userId) return res.status(400).json({ error: "Missing userId" });

  let filtered = ITEMS.filter((item) => item.includes(search));

  const user = userState[userId] || { selected: [], order: [] };
  userState[userId] = user;

  const orderedSet = new Set(user.order);
  const ordered = user.order.filter((id) => filtered.includes(id));
  const rest = filtered.filter((id) => !orderedSet.has(id));

  const result = [...ordered, ...rest];
  const paginated = result.slice(
    Number(offset),
    Number(offset) + Number(limit)
  );

  res.json({
    items: paginated,
    total: result.length,
    selected: user.selected,
  });
});

app.post("/order", (req, res) => {
  const { userId, order: newPartialOrder } = req.body;

  if (!userId || !Array.isArray(newPartialOrder)) {
    return res.status(400).json({ error: "Invalid request" });
  }

  if (!userState[userId]) userState[userId] = { selected: [], order: [] };
  const oldOrder = userState[userId].order;

  const newSet = new Set(newPartialOrder);
  const cleanedOldOrder = oldOrder.filter((id) => !newSet.has(id));

  userState[userId].order = [...newPartialOrder, ...cleanedOldOrder];

  res.json({ status: "ok" });
});

app.post("/select", (req, res) => {
  const { userId, selected } = req.body;

  if (!userId || !Array.isArray(selected)) {
    return res.status(400).json({ error: "Invalid request" });
  }

  if (!userState[userId]) userState[userId] = { selected: [], order: [] };

  userState[userId].selected = selected;

  res.json({ status: "ok" });
});

app.listen(5000, () => console.log("server running"));
