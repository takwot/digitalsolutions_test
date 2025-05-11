import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import LoadMoreTrigger from "./LoadMoreTrigger";
import { useCallback, useEffect, useState } from "react";
import SortableItem from "./SortableItem";

const API_URL = "http://212.109.223.30:8880";
const USER_ID = "test-user";

export const ItemList = ({ search, setTotal }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [items, setItems] = useState([]);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [selected, setSelected] = useState([]);
  const limit = 20;

  const handleToggle = async (id) => {
    const updated = selected.includes(id)
      ? selected.filter((i) => i !== id)
      : [...selected, id];

    setSelected(updated);
    await fetch(`${API_URL}/select`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: USER_ID, selected: updated }),
    });
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = items.indexOf(active.id);
    const newIndex = items.indexOf(over.id);
    const newItems = arrayMove(items, oldIndex, newIndex);
    setItems(newItems);

    await fetch(`${API_URL}/order`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: USER_ID, order: newItems }),
    });
  };

  const fetchData = useCallback(
    async (reset = false) => {
      if (isLoading) return;
      setIsLoading(true);

      const currentOffset = reset ? 0 : offset;
      const res = await fetch(
        `${API_URL}/items?userId=${USER_ID}&search=${search}&offset=${currentOffset}&limit=${limit}`
      );
      const data = await res.json();

      setTotal(data.total);

      if (reset) {
        setItems(data.items);
        setOffset(limit);
      } else {
        setItems((prev) => [...prev, ...data.items]);
        setOffset((prev) => prev + limit);
      }

      setSelected(data.selected);
      setHasMore(data.items.length === limit);
      setIsLoading(false);
    },
    [offset, search, isLoading]
  );

  useEffect(() => {
    setOffset(0);
    fetchData(true);
  }, [search]);

  return (
    <div className="list">
      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={items} strategy={verticalListSortingStrategy}>
          {items.map((id) => (
            <SortableItem
              key={id}
              id={id}
              isSelected={selected.includes(id)}
              onToggle={handleToggle}
            />
          ))}
          <LoadMoreTrigger
            hasNextPage={hasMore}
            loadMore={fetchData}
            isLoading={isLoading}
          />
        </SortableContext>
      </DndContext>
    </div>
  );
};
