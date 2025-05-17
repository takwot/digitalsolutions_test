import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const SortableItem = ({ id, isSelected, onToggle }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    background: isSelected ? "#cce5ff" : "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0.5rem",
    borderBottom: "1px solid #eee",
  };

  return (
    <div ref={setNodeRef} style={style} className="item">
      <label style={{ flex: 1, cursor: "pointer" }}>
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onToggle(id)}
          style={{ marginRight: "0.5rem" }}
        />
        {id}
      </label>
      <span
        {...attributes}
        {...listeners}
        style={{
          cursor: "grab",
          padding: "0.25rem 0.5rem",
          background: "#ddd",
          borderRadius: "4px",
        }}
      >
        ☰
      </span>
    </div>
  );
};

export default SortableItem;
