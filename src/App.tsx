import { DndContext, DragEndEvent, DragMoveEvent, useDndMonitor } from '@dnd-kit/core';
import { useState, useRef } from 'react';
import type { SheetLayout } from './types/layout';
import { ComponentPalette } from './components/ComponentPalette';
import { LayoutRenderer } from './components/LayoutRenderer';
import { splitNode, updateSplitRatio } from './utils/layoutOperations';

function App() {
  const [layout, setLayout] = useState<SheetLayout>(() => createInitialLayout());
  const lastMousePosRef = useRef<{ x: number; y: number } | null>(null);
  
  function handleDragMove(event: DragMoveEvent) {
    const mouseEvent = event.activatorEvent as MouseEvent;
    lastMousePosRef.current = {
      x: mouseEvent.clientX + event.delta.x,
      y: mouseEvent.clientY + event.delta.y,
    };
  }
  
  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    
    if (!over || active.data.current?.source !== 'palette') return;
    
    const targetNodeId = over.data.current?.nodeId;
    const componentType = active.data.current?.type;
    
    if (targetNodeId && componentType && lastMousePosRef.current) {
      const mouseX = lastMousePosRef.current.x;
      const mouseY = lastMousePosRef.current.y;
      
      // Get target bounds
      const targetRect = over.rect;
      const targetCenterX = targetRect.left + targetRect.width / 2;
      const targetCenterY = targetRect.top + targetRect.height / 2;
      
      // Calculate percentage deviations from center
      const deviationX = Math.abs(mouseX - targetCenterX) / (targetRect.width / 2);
      const deviationY = Math.abs(mouseY - targetCenterY) / (targetRect.height / 2);
      
      // Determine split direction based on highest deviation
      const splitDirection = deviationX > deviationY ? 'horizontal' : 'vertical';
      
      // Determine which side the new node should be on
      const isAfter = splitDirection === 'horizontal' 
        ? mouseX > targetCenterX 
        : mouseY > targetCenterY;
      
      setLayout(prev => splitNode(prev, targetNodeId, componentType, splitDirection, isAfter));
    }
    
    lastMousePosRef.current = null;
  }
  
  function handleRatioChange(splitId: string, newRatio: number) {
    setLayout(prev => updateSplitRatio(prev, splitId, newRatio));
  }
  
  function handleClearLayout() {
    setLayout(createInitialLayout());
  }
  
  return (
    <DndContext onDragMove={handleDragMove} onDragEnd={handleDragEnd}>
      <ComponentPalette />
      <button onClick={handleClearLayout}>Clear Layout</button>
      <LayoutRenderer
        page={layout.pages[0]}
        onRatioChange={handleRatioChange}
      />
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
        placeholder: '',
      }
    }]
  };
}

export default App;
