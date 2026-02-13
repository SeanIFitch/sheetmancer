import {Edge} from "yoga-layout";
import {Bounds} from "../types/layout";

/**
 * Calculate the center point of each edge and find which is closest to the cursor
 *
 * @param cursorX - Cursor X position in client coordinates
 * @param cursorY - Cursor Y position in client coordinates
 * @param bounds - Bounds of the target panel (in client coordinates)
 * @returns edge to add the new node on
 */
export function calculateEdgeCenterSplit(
    cursorX: number,
    cursorY: number,
    bounds: Bounds
): Edge {
  const cx = bounds.left + bounds.width / 2;
  const cy = bounds.top + bounds.height / 2;

  const edgeCenters: { edge: Edge; x: number; y: number }[] = [
    { edge: Edge.Top,    x: cx, y: bounds.top },
    { edge: Edge.Bottom, x: cx, y: bounds.top + bounds.height },
    { edge: Edge.Left,   x: bounds.left, y: cy },
    { edge: Edge.Right,  x: bounds.left + bounds.width, y: cy },
  ];

  let closest = edgeCenters[0];
  let minDist = Infinity;

  for (const e of edgeCenters) {
    const dx = cursorX - e.x;
    const dy = cursorY - e.y;
    const dist = dx * dx + dy * dy;

    if (dist < minDist) {
      minDist = dist;
      closest = e;
    }
  }

  return closest.edge;
}
