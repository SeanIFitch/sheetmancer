import type {LayoutNode, LeafNode, SheetLayout, SplitNode} from '../types/layout';
import {Edge} from "yoga-layout";

/**
 * Replace a leaf node with a split containing the original + new node,
 * or replace initial component node directly
 */
export function splitNode(
  layout: SheetLayout,
  targetId: string,
  newPlaceholder: string,
  edge: Edge
): SheetLayout {
  const newLayout = structuredClone(layout);
  
  // Find and replace the target node
  const replaced = replaceNode(newLayout.pages[0].root, targetId, (node) => {
    if (node.type !== 'leaf') return node;
    
    // If this is an initial component (empty string), replace it directly
    if (node.component === '') {
      return {
        type: 'leaf',
        id: node.id,
        component: newPlaceholder,
      };
    }
    
    // Create new leaf for the new component
    const newLeaf: LeafNode = {
      type: 'leaf',
      id: crypto.randomUUID(),
      component: newPlaceholder,
    };

    const direction = edge === Edge.Top || edge === Edge.Bottom ? 'vertical' : 'horizontal';
    const isAfter = edge === Edge.Bottom || edge === Edge.Right;

    const newSplit: SplitNode = {
      type: 'split',
      id: crypto.randomUUID(),
      direction: direction,
      ratio: 0.5,
      children: isAfter ? [node, newLeaf] : [newLeaf, node]
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
    const updatedFirstChild = updateNodeRatio(node.children[0], splitId, newRatio);
    if (updatedFirstChild) {
      node.children[0] = updatedFirstChild;
      return node;
    }
    
    const updatedSecondChild = updateNodeRatio(node.children[1], splitId, newRatio);
    if (updatedSecondChild) {
      node.children[1] = updatedSecondChild;
      return node;
    }
  }
  
  return null;
}

/**
 * Get the depth of a node in the tree (number of split ancestors)
 * Returns null if node is not found
 */
function getNodeDepth(node: LayoutNode, targetId: string, depth: number = 0): number | null {
  if (node.id === targetId) {
    return depth;
  }
  
  if (node.type === 'split') {
    const leftDepth = getNodeDepth(node.children[0], targetId, depth + 1);
    if (leftDepth !== null) return leftDepth;
    
    const rightDepth = getNodeDepth(node.children[1], targetId, depth + 1);
    if (rightDepth !== null) return rightDepth;
  }
  
  return null;
}
