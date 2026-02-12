import { useDroppable } from '@dnd-kit/core';
import type { PageLayout, LayoutNode } from '../types/layout';
import { calculateLayout } from '../engine/yogaEngine';
import { ResizableSplit } from './ResizableSplit';

interface Props {
  page: PageLayout;
  onNodeClick?: (nodeId: string) => void;
  onRatioChange?: (splitId: string, newRatio: number) => void;
}

export function LayoutRenderer({ page, onNodeClick, onRatioChange }: Props) {
  const layoutResults = calculateLayout(page);
  
  // Collect all split nodes for rendering dividers
  const splits = collectSplits(page.root, layoutResults);
  
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
          placeholder={result.placeholder}
          onClick={() => onNodeClick?.(result.id)}
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
  bounds: { left: number; top: number; width: number; height: number };
  placeholder?: string;
  onClick?: () => void;
}

function DroppableLayoutNode({ id, bounds, placeholder, onClick }: DroppableNodeProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: id,
    data: { nodeId: id },
  });
  
  return (
    <div
      ref={setNodeRef}
      onClick={onClick}
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
      }}
    >
      {placeholder || id}
    </div>
  );
}

interface SplitInfo {
  id: string;
  direction: 'horizontal' | 'vertical';
  ratio: number;
  bounds: { left: number; top: number; width: number; height: number };
}

function collectSplits(
  node: LayoutNode,
  layoutResults: ReturnType<typeof calculateLayout>
): SplitInfo[] {
  if (node.type === 'leaf') {
    return [];
  }
  
  // Find the bounds that encompass this split's children
  const firstChildId = getFirstLeafId(node.children[0]);
  const secondChildId = getFirstLeafId(node.children[1]);
  
  const firstResult = layoutResults.find(r => r.id === firstChildId);
  const secondResult = layoutResults.find(r => r.id === secondChildId);
  
  if (!firstResult || !secondResult) {
    return [
      ...collectSplits(node.children[0], layoutResults),
      ...collectSplits(node.children[1], layoutResults),
    ];
  }
  
  // Calculate the bounds that encompass both children
  const left = Math.min(firstResult.bounds.left, secondResult.bounds.left);
  const top = Math.min(firstResult.bounds.top, secondResult.bounds.top);
  const right = Math.max(
    firstResult.bounds.left + firstResult.bounds.width,
    secondResult.bounds.left + secondResult.bounds.width
  );
  const bottom = Math.max(
    firstResult.bounds.top + firstResult.bounds.height,
    secondResult.bounds.top + secondResult.bounds.height
  );
  
  return [
    {
      id: node.id,
      direction: node.direction,
      ratio: node.ratio,
      bounds: {
        left,
        top,
        width: right - left,
        height: bottom - top,
      },
    },
    ...collectSplits(node.children[0], layoutResults),
    ...collectSplits(node.children[1], layoutResults),
  ];
}

function getFirstLeafId(node: LayoutNode): string {
  if (node.type === 'leaf') {
    return node.id;
  }
  return getFirstLeafId(node.children[0]);
}
