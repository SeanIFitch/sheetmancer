import { useDroppable, useDndContext } from '@dnd-kit/core';
import React from 'react';
import type { PageLayout, LayoutNodeBounds } from '../types/layout';
import { ResizableSplit } from './ResizableSplit';
import { calculateEdgeCenterSplit } from '../utils/dragSplitHeuristic';
import {Edge} from "yoga-layout";
import {Bounds} from "../types/layout";

interface Props {
  page: PageLayout;
  onNodeClick?: (nodeId: string) => void;
  onRatioChange?: (splitId: string, newRatio: number) => void;
}

export function LayoutRenderer({ page, onNodeClick, onRatioChange }: Props) {
  const layoutResults = page.getLayout();
  
  // Get all split nodes for rendering dividers
  const splits = page.getSplits();
  
  return (
    <div
      style={{
        position: 'relative',
        width: page.width,
        height: page.height,
        border: '1px solid black',
      }}
    >
      {layoutResults.map(result => (
        <DroppableLayoutNode
          key={result.id}
          id={result.id}
          bounds={result.bounds}
          component={result.component}
          onClick={() => onNodeClick?.(result.id)}
          depth={result.depth}
        />
      ))}
      {onRatioChange && splits.map(split => (
        <ResizableSplit
          key={split.id}
          splitId={split.id}
          direction={split.direction}
          ratio={split.ratio}
          bounds={split.bounds}
          onRatioChange={onRatioChange}
        />
      ))}
    </div>
  );
}

interface DroppableNodeProps {
  id: string;
  bounds: Bounds;
  component?: string;
  onClick?: () => void;
  depth?: number;
}

function DroppableLayoutNode({ id, bounds, component, onClick }: DroppableNodeProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: id,
    data: { nodeId: id },
  });
  const { active } = useDndContext();
  const [dragMousePosition, setDragMousePosition] = React.useState<{ x: number; y: number } | null>(null);
  
  const isDragging = active?.data.current?.source === 'palette';
  const isPlaceholder = component === '';
  
  // Reset mouse position when drag ends or hover stops
  React.useEffect(() => {
    if (!isOver || !isDragging) {
      setDragMousePosition(null);
    }
  }, [isOver, isDragging]);
  
  // Calculate split info based on mouse position using edge-centered heuristic
  let edge = Edge.Left;

  if (dragMousePosition && !isPlaceholder) {
    edge = calculateEdgeCenterSplit(
      dragMousePosition.x,
      dragMousePosition.y,
      bounds
    );
  }

  const direction = edge === Edge.Top || edge === Edge.Bottom ? 'vertical' : 'horizontal';
  const isAfter = edge === Edge.Bottom || edge === Edge.Right;

  const handleMouseMove = React.useCallback((e: React.MouseEvent) => {
    if (isDragging && isOver) {
      setDragMousePosition({ x: e.clientX, y: e.clientY });
    }
  }, [isDragging, isOver]);
  
  return (
    <div
      ref={setNodeRef}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      style={{
        position: 'absolute',
        left: bounds.left,
        top: bounds.top,
        width: bounds.width,
        height: bounds.height,
        border: isOver ? '2px solid blue' : '1px solid #ccc',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'auto',
        zIndex: 1,
        boxSizing: 'border-box',
        backgroundColor: isOver && isDragging ? 'rgba(0, 0, 255, 0.1)' : 'transparent',
        color: '#999',
        fontSize: '14px',
      }}
    >
      {component ?? 'UNDEFINED'}
      {isOver && isDragging && !isPlaceholder && (
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            display: 'flex',
            flexDirection: direction === 'horizontal' ? 'row' : 'column',
          }}
        >
          {!isAfter && (
            <div style={{
              flex: 1,
              border: '2px dashed green',
              backgroundColor: 'rgba(0, 255, 0, 0.05)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '12px',
              color: '#666',
            }}>
              New
            </div>
          )}
          <div style={{
            flex: 1,
            border: '2px dashed blue',
            backgroundColor: 'rgba(0, 0, 255, 0.05)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '12px',
            color: '#666',
          }}>
            Current
          </div>
          {isAfter && (
            <div style={{
              flex: 1,
              border: '2px dashed green',
              backgroundColor: 'rgba(0, 255, 0, 0.05)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '12px',
              color: '#666',
            }}>
              New
            </div>
          )}
        </div>
      )}
      {isOver && isDragging && isPlaceholder && (
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '2px dashed green',
            backgroundColor: 'rgba(0, 255, 0, 0.1)',
            fontSize: '12px',
            color: '#666',
          }}
        >
          Replace
        </div>
      )}
    </div>
  );
}

export default LayoutRenderer;
