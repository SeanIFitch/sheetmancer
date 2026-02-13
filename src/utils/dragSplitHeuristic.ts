/**
 * Edge-centered drag split heuristic for Yoga layout
 * 
 * Determines the split direction and side based on which edge center
 * is closest to the cursor position.
 */

export interface Bounds {
  left: number;
  top: number;
  width: number;
  height: number;
}

export interface SplitInfo {
  direction: 'horizontal' | 'vertical';
  isAfter: boolean;
  edge: 'top' | 'bottom' | 'left' | 'right';
}

export interface DragSplitResult {
  targetNodeId: string;
  splitInfo: SplitInfo;
}

/**
 * Calculate the center point of each edge and find which is closest to the cursor
 * 
 * @param cursorX - Cursor X position in client coordinates
 * @param cursorY - Cursor Y position in client coordinates
 * @param bounds - Bounds of the target panel (in client coordinates)
 * @returns Split information indicating direction, side, and closest edge
 */
export function calculateEdgeCenterSplit(
  cursorX: number,
  cursorY: number,
  bounds: Bounds
): SplitInfo {
  // Calculate center points of each edge
  const edges = {
    top: {
      x: bounds.left + bounds.width / 2,
      y: bounds.top,
      edge: 'top' as const,
    },
    bottom: {
      x: bounds.left + bounds.width / 2,
      y: bounds.top + bounds.height,
      edge: 'bottom' as const,
    },
    left: {
      x: bounds.left,
      y: bounds.top + bounds.height / 2,
      edge: 'left' as const,
    },
    right: {
      x: bounds.left + bounds.width,
      y: bounds.top + bounds.height / 2,
      edge: 'right' as const,
    },
  };

  // Calculate distance to each edge center
  const distances = Object.values(edges).map(edge => ({
    edge: edge.edge,
    distance: Math.sqrt(
      Math.pow(cursorX - edge.x, 2) + Math.pow(cursorY - edge.y, 2)
    ),
  }));

  // Find the edge with minimum distance
  const closest = distances.reduce((min, current) =>
    current.distance < min.distance ? current : min
  );

  // Determine split direction and side based on closest edge
  let direction: 'horizontal' | 'vertical';
  let isAfter: boolean;

  switch (closest.edge) {
    case 'top':
      direction = 'vertical';
      isAfter = false; // New panel goes before (top)
      break;
    case 'bottom':
      direction = 'vertical';
      isAfter = true; // New panel goes after (bottom)
      break;
    case 'left':
      direction = 'horizontal';
      isAfter = false; // New panel goes before (left)
      break;
    case 'right':
      direction = 'horizontal';
      isAfter = true; // New panel goes after (right)
      break;
    default:
      // Should never happen, but provide safe fallback
      direction = 'horizontal';
      isAfter = true;
      break;
  }

  return {
    direction,
    isAfter,
    edge: closest.edge,
  };
}
