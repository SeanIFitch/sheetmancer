import { DndContext, DragEndEvent, DragMoveEvent } from '@dnd-kit/core';
import { useState, useRef } from 'react';
import type { SheetLayout } from './types/layout';
import { PageLayout } from './types/layout';
import { ComponentPalette } from './components/ComponentPalette';
import { LayoutRenderer } from './components/LayoutRenderer';


function App() {
  const [layout, setLayout] = useState<SheetLayout>(() => createInitialLayout());
  const dragMousePositionRef = useRef<{ x: number; y: number } | null>(null);
  
  function handleDragMove(event: DragMoveEvent) {
    const mouseEvent = event.activatorEvent;
    // Only handle mouse/pointer events
    if ('clientX' in mouseEvent && 'clientY' in mouseEvent) {
      dragMousePositionRef.current = {
        x: mouseEvent.clientX + event.delta.x,
        y: mouseEvent.clientY + event.delta.y,
      };
    }
  }
  
  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    
    if (!over || active.data.current?.source !== 'palette') return;
    
    const targetNodeId = over.data.current?.nodeId;
    const componentType = active.data.current?.type;
    
    if (targetNodeId && componentType && dragMousePositionRef.current) {
      const mouseX = dragMousePositionRef.current.x;
      const mouseY = dragMousePositionRef.current.y;
      
      const page = layout.pages[0];
      const edge = page.getClosestEdge(targetNodeId, mouseX, mouseY);
      
      if (edge !== null) {
        const newPage = page.splitNode(targetNodeId, edge, componentType);
        setLayout({
          pages: [newPage]
        });
      }
    }
    
    dragMousePositionRef.current = null;
  }
  
  function handleRatioChange(splitId: string, newRatio: number) {
    const page = layout.pages[0];
    const newPage = page.resizeSplit(splitId, newRatio);
    setLayout({
      pages: [newPage]
    });
  }
  
  function handleClearLayout() {
    setLayout(createInitialLayout());
  }

  return (
    <DndContext onDragMove={handleDragMove} onDragEnd={handleDragEnd}>
      <div style={{ display: 'flex' }}>
        <div>
          <ComponentPalette />
          <button onClick={handleClearLayout}>Clear Layout</button>
        </div>

        <LayoutRenderer
          page={layout.pages[0]}
          onRatioChange={handleRatioChange}
        />
      </div>
    </DndContext>
  );
}

function createInitialLayout(): SheetLayout {
  return {
    pages: [new PageLayout({
      id: crypto.randomUUID(),
      width: 816,
      height: 1056,
      rootComponent: '',
    })]
  };
}

export default App;
