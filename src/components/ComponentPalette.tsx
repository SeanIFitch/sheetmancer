import { useDraggable } from '@dnd-kit/core';

const COMPONENT_TYPES = ['checkbox', 'text', 'abilities', 'skills', 'spells'];

export function ComponentPalette() {
  return (
    <div style={{ border: '1px solid black', padding: 8 }}>
      <h3>Components</h3>
      {COMPONENT_TYPES.map(type => (
        <DraggableComponent key={type} type={type} />
      ))}
    </div>
  );
}

function DraggableComponent({ type }: { type: string }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `palette-${type}`,
    data: { type, source: 'palette' },
  });
  
  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={{
        border: '1px solid black',
        padding: 4,
        margin: 4,
        cursor: 'grab',
        opacity: isDragging ? 0.5 : 1,
      }}
    >
      {type}
    </div>
  );
}
