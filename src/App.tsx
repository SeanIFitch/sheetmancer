import { DndContext, DragEndEvent, DragMoveEvent } from '@dnd-kit/core';
import { useState, useRef } from 'react';
import type {LayoutNode, SheetLayout} from './types/layout';
import { ComponentPalette } from './components/ComponentPalette';
import { LayoutRenderer } from './components/LayoutRenderer';
import { splitNode, updateSplitRatio } from './utils/layoutOperations';
import { calculateEdgeCenterSplit } from './utils/dragSplitHeuristic';

function layoutTreeToString(node: LayoutNode, indent = ""): string {
  if ("children" in node) {
    let str = `${indent}- SplitNode (id: ${node.id}, direction: ${node.direction})\n`;
    for (const child of node.children) {
      str += layoutTreeToString(child, indent + "  ");
    }
    return str;
  } else {
    return `${indent}- LeafNode (id: ${node.id}, component: ${node.component})\n`;
  }
}

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
      
      const edge = calculateEdgeCenterSplit(
        mouseX,
        mouseY,
        over.rect
      );
      
      setLayout(prev => splitNode(
        prev,
        targetNodeId,
        componentType,
        edge
      ));
    }
    
    dragMousePositionRef.current = null;
  }
  
  function handleRatioChange(splitId: string, newRatio: number) {
    setLayout(prev => updateSplitRatio(prev, splitId, newRatio));
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
          <pre>{layoutTreeToString(layout.pages[0].root)}</pre>
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
    pages: [{
      id: crypto.randomUUID(),
      width: 816,
      height: 1056,
      root: {
        type: 'leaf',
        id: crypto.randomUUID(),
        component: undefined,
      }
    }]
  };
}

export default App;
