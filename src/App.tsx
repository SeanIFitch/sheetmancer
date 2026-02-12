import { DndContext, DragEndEvent } from '@dnd-kit/core';
import { useState } from 'react';
import type { SheetLayout } from './types/layout';
import { ComponentPalette } from './components/ComponentPalette';
import { LayoutRenderer } from './components/LayoutRenderer';
import { splitNode, updateSplitRatio } from './utils/layoutOperations';

function App() {
  const [layout, setLayout] = useState<SheetLayout>(() => createInitialLayout());
  
  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    
    if (!over || active.data.current?.source !== 'palette') return;
    
    const targetNodeId = over.data.current?.nodeId;
    const componentType = active.data.current?.type;
    
    if (targetNodeId && componentType) {
      setLayout(prev => splitNode(prev, targetNodeId, componentType));
    }
  }
  
  function handleRatioChange(splitId: string, newRatio: number) {
    setLayout(prev => updateSplitRatio(prev, splitId, newRatio));
  }
  
  function handleClearLayout() {
    setLayout(createInitialLayout());
  }
  
  return (
    <DndContext onDragEnd={handleDragEnd}>
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
