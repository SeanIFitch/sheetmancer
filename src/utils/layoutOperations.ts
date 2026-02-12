import type { SheetLayout, LayoutNode, SplitNode, LeafNode } from '../types/layout';

/**
 * Replace a leaf node with a split containing the original + new node
 */
export function splitNode(
  layout: SheetLayout,
  targetId: string,
  newPlaceholder: string
): SheetLayout {
  const newLayout = structuredClone(layout);
  
  // Find and replace the target node
  const replaced = replaceNode(newLayout.pages[0].root, targetId, (node) => {
    if (node.type !== 'leaf') return node;
    
    // Create new split with original node and new leaf
    const newSplit: SplitNode = {
      type: 'split',
      id: crypto.randomUUID(),
      direction: Math.random() > 0.5 ? 'horizontal' : 'vertical',
      ratio: 0.5,
      children: [
        node,
        {
          type: 'leaf',
          id: crypto.randomUUID(),
          placeholder: newPlaceholder,
        }
      ]
    };
    
    return newSplit;
  });
  
  if (replaced) {
    newLayout.pages[0].root = replaced;
  }
  
  return newLayout;
}

/**
 * Update the ratio of a split node
 */
export function updateSplitRatio(
  layout: SheetLayout,
  splitId: string,
  newRatio: number
): SheetLayout {
  // Clamp ratio between 0.1 and 0.9
  const clampedRatio = Math.max(0.1, Math.min(0.9, newRatio));
  
  const newLayout = structuredClone(layout);
  
  const updated = updateNodeRatio(newLayout.pages[0].root, splitId, clampedRatio);
  if (updated) {
    newLayout.pages[0].root = updated;
  }
  
  return newLayout;
}

/**
 * Recursively find a node by ID
 */
function findNode(node: LayoutNode, targetId: string): LayoutNode | null {
  if (node.id === targetId) {
    return node;
  }
  
  if (node.type === 'split') {
    const found = findNode(node.children[0], targetId);
    if (found) return found;
    
    return findNode(node.children[1], targetId);
  }
  
  return null;
}

/**
 * Recursively replace a node
 */
function replaceNode(
  node: LayoutNode,
  targetId: string,
  replacer: (node: LayoutNode) => LayoutNode
): LayoutNode | null {
  if (node.id === targetId) {
    return replacer(node);
  }
  
  if (node.type === 'split') {
    const newFirst = replaceNode(node.children[0], targetId, replacer);
    if (newFirst) {
      node.children[0] = newFirst;
      return node;
    }
    
    const newSecond = replaceNode(node.children[1], targetId, replacer);
    if (newSecond) {
      node.children[1] = newSecond;
      return node;
    }
  }
  
  return null;
}

/**
 * Recursively update a split node's ratio
 */
function updateNodeRatio(
  node: LayoutNode,
  splitId: string,
  newRatio: number
): LayoutNode | null {
  if (node.id === splitId && node.type === 'split') {
    node.ratio = newRatio;
    return node;
  }
  
  if (node.type === 'split') {
    const updated = updateNodeRatio(node.children[0], splitId, newRatio);
    if (updated) {
      node.children[0] = updated;
      return node;
    }
    
    const updated2 = updateNodeRatio(node.children[1], splitId, newRatio);
    if (updated2) {
      node.children[1] = updated2;
      return node;
    }
  }
  
  return null;
}
