import Yoga, { Node, Edge } from 'yoga-layout';

/**
 * Default split ratio for new splits
 */
const DEFAULT_SPLIT_RATIO = 0.5;

/**
 * Generate a unique ID (fallback for environments without crypto API)
 */
function generateId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback for environments without crypto API
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Metadata for each yoga node
 */
interface NodeMetadata {
  id: string;
  component?: string;
  direction?: 'horizontal' | 'vertical';
  ratio?: number;
}

/**
 * Layout configuration for a single page (8.5" x 11" at 96dpi)
 */
export interface PageLayoutConfig {
  id: string;
  width: number;  // 816 (8.5 * 96)
  height: number; // 1056 (11 * 96)
  rootComponent?: string; // Initial component
}

/**
 * PageLayout class - manages page layout using only Yoga tree
 */
export class PageLayout {
  private readonly _id: string;
  private readonly _width: number;
  private readonly _height: number;
  private readonly _yogaRoot: Node;
  private readonly _metadata: Map<Node, NodeMetadata>;
  private _layoutCache: LayoutNodeBounds[] | null = null;

  constructor(config: PageLayoutConfig) {
    this._id = config.id;
    this._width = config.width;
    this._height = config.height;
    this._metadata = new Map();
    
    // Create initial yoga tree with a single leaf node
    this._yogaRoot = Yoga.Node.create();
    this._yogaRoot.setFlexGrow(1);
    this._metadata.set(this._yogaRoot, {
      id: generateId(),
      component: config.rootComponent ?? '',
    });
  }

  get id(): string {
    return this._id;
  }

  get width(): number {
    return this._width;
  }

  get height(): number {
    return this._height;
  }

  /**
   * Get root node metadata for backwards compatibility
   * @deprecated This getter is provided for backwards compatibility with components
   * that expect a root property. Use getLayout() to access node information.
   */
  get root(): { type: 'legacy'; id: string } {
    const metadata = this._metadata.get(this._yogaRoot);
    return {
      type: 'legacy',
      id: metadata?.id ?? 'unknown',
    };
  }

  /**
   * Get computed layout for all nodes
   */
  getLayout(): LayoutNodeBounds[] {
    if (!this._layoutCache) {
      this._layoutCache = this._computeLayout();
    }
    return this._layoutCache;
  }

  /**
   * Invalidate layout cache
   */
  private _invalidateCache(): void {
    this._layoutCache = null;
  }

  /**
   * Get all splits for rendering dividers
   */
  getSplits(): Array<{
    id: string;
    direction: 'horizontal' | 'vertical';
    ratio: number;
    bounds: Bounds;
  }> {
    const layout = this.getLayout();
    const splits: Array<{
      id: string;
      direction: 'horizontal' | 'vertical';
      ratio: number;
      bounds: Bounds;
    }> = [];

    this._collectSplitsFromNode(this._yogaRoot, layout, splits);
    return splits;
  }

  private _collectSplitsFromNode(
    node: Node,
    layout: LayoutNodeBounds[],
    splits: Array<{
      id: string;
      direction: 'horizontal' | 'vertical';
      ratio: number;
      bounds: Bounds;
    }>
  ): void {
    const metadata = this._metadata.get(node);
    if (!metadata || !metadata.direction) {
      // Not a split node, check children
      const childCount = node.getChildCount();
      for (let i = 0; i < childCount; i++) {
        this._collectSplitsFromNode(node.getChild(i), layout, splits);
      }
      return;
    }

    // This is a split node, get its bounds from children
    const childCount = node.getChildCount();
    if (childCount !== 2) return;

    const firstChild = node.getChild(0);
    const secondChild = node.getChild(1);

    const firstLeafId = this._getFirstLeafId(firstChild);
    const secondLeafId = this._getFirstLeafId(secondChild);

    const firstResult = layout.find(r => r.id === firstLeafId);
    const secondResult = layout.find(r => r.id === secondLeafId);

    if (firstResult && secondResult) {
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

      splits.push({
        id: metadata.id,
        direction: metadata.direction,
        ratio: metadata.ratio ?? DEFAULT_SPLIT_RATIO,
        bounds: {
          left,
          top,
          width: right - left,
          height: bottom - top,
        },
      });
    }

    // Recurse into children
    this._collectSplitsFromNode(firstChild, layout, splits);
    this._collectSplitsFromNode(secondChild, layout, splits);
  }

  private _getFirstLeafId(node: Node): string | null {
    const metadata = this._metadata.get(node);
    if (!metadata) return null;

    if (metadata.component !== undefined) {
      return metadata.id;
    }

    const childCount = node.getChildCount();
    if (childCount > 0) {
      return this._getFirstLeafId(node.getChild(0));
    }

    return null;
  }

  /**
   * Get node ID by coordinates (accounts for page offset)
   * @param x - X coordinate relative to page
   * @param y - Y coordinate relative to page
   * @returns Node ID at the given coordinates or null if not found
   */
  getNodeIdByCoordinates(x: number, y: number): string | null {
    const layout = this.getLayout();
    
    // Find the deepest (most specific) node at these coordinates
    let deepestNode: LayoutNodeBounds | null = null;
    let maxDepth = -1;

    for (const node of layout) {
      const { left, top, width, height } = node.bounds;
      if (
        x >= left &&
        x <= left + width &&
        y >= top &&
        y <= top + height &&
        node.depth > maxDepth
      ) {
        deepestNode = node;
        maxDepth = node.depth;
      }
    }

    return deepestNode?.id ?? null;
  }

  /**
   * Get closest edge of a node by ID and coordinates
   * @param nodeId - ID of the node
   * @param x - X coordinate relative to page
   * @param y - Y coordinate relative to page
   * @returns Closest edge or null if node not found
   */
  getClosestEdge(nodeId: string, x: number, y: number): Edge | null {
    const layout = this.getLayout();
    const node = layout.find((n) => n.id === nodeId);

    if (!node) {
      return null;
    }

    const bounds = node.bounds;
    const cx = bounds.left + bounds.width / 2;
    const cy = bounds.top + bounds.height / 2;

    const edgeCenters: { edge: Edge; x: number; y: number }[] = [
      { edge: Edge.Top, x: cx, y: bounds.top },
      { edge: Edge.Bottom, x: cx, y: bounds.top + bounds.height },
      { edge: Edge.Left, x: bounds.left, y: cy },
      { edge: Edge.Right, x: bounds.left + bounds.width, y: cy },
    ];

    let closest = edgeCenters[0];
    let minDist = Infinity;

    for (const e of edgeCenters) {
      const dx = x - e.x;
      const dy = y - e.y;
      const dist = dx * dx + dy * dy;

      if (dist < minDist) {
        minDist = dist;
        closest = e;
      }
    }

    return closest.edge;
  }

  /**
   * Split a node and add a new leaf
   * @param nodeId - ID of the node to split
   * @param edge - Edge to add the new leaf on
   * @param component - Component for the new leaf
   */
  splitNode(nodeId: string, edge: Edge, component: string): PageLayout {
    const targetNode = this._findNodeById(nodeId);
    if (!targetNode) return this;

    const metadata = this._metadata.get(targetNode);
    if (!metadata) return this;

    // If this is an initial component (empty string), replace it directly
    if (metadata.component === '') {
      metadata.component = component;
      this._invalidateCache();
      return this;
    }

    // Create new layout with split
    const newLayout = new PageLayout({
      id: this._id,
      width: this._width,
      height: this._height,
    });

    // Clone the yoga tree structure
    this._cloneYogaTree(this._yogaRoot, newLayout._yogaRoot, newLayout._metadata);

    // Find the target node in the new tree
    const newTargetNode = newLayout._findNodeById(nodeId);
    if (!newTargetNode) return this;

    // Get parent and find target's position
    const parent = newLayout._findParent(newTargetNode);
    const isRoot = parent === null;
    const childIndex = parent ? newLayout._getChildIndex(parent, newTargetNode) : -1;

    // Create new split container
    const splitNode = Yoga.Node.create();
    const direction = edge === Edge.Top || edge === Edge.Bottom ? 'vertical' : 'horizontal';
    
    if (direction === 'horizontal') {
      splitNode.setFlexDirection(Yoga.FLEX_DIRECTION_ROW);
    } else {
      splitNode.setFlexDirection(Yoga.FLEX_DIRECTION_COLUMN);
    }

    newLayout._metadata.set(splitNode, {
      id: generateId(),
      direction,
      ratio: DEFAULT_SPLIT_RATIO,
    });

    // Create new leaf
    const newLeaf = Yoga.Node.create();
    newLeaf.setFlexGrow(1);
    newLayout._metadata.set(newLeaf, {
      id: generateId(),
      component,
    });

    // Configure flexGrow for children
    newTargetNode.setFlexGrow(DEFAULT_SPLIT_RATIO);
    newLeaf.setFlexGrow(DEFAULT_SPLIT_RATIO);

    // Arrange children based on edge
    const isAfter = edge === Edge.Bottom || edge === Edge.Right;
    if (isAfter) {
      splitNode.insertChild(newTargetNode, 0);
      splitNode.insertChild(newLeaf, 1);
    } else {
      splitNode.insertChild(newLeaf, 0);
      splitNode.insertChild(newTargetNode, 1);
    }

    // Replace target node with split node
    if (isRoot) {
      // Need to copy split node contents to root
      newLayout._yogaRoot.setFlexDirection(splitNode.getFlexDirection());
      const splitMetadata = newLayout._metadata.get(splitNode);
      if (splitMetadata) {
        newLayout._metadata.set(newLayout._yogaRoot, splitMetadata);
      }
      
      for (let i = 0; i < splitNode.getChildCount(); i++) {
        const child = splitNode.getChild(i);
        newLayout._yogaRoot.insertChild(child, i);
      }
      splitNode.free();
    } else {
      parent!.removeChild(newTargetNode);
      parent!.insertChild(splitNode, childIndex);
    }

    newLayout._invalidateCache();
    return newLayout;
  }

  /**
   * Resize a split by updating its ratio
   * @param splitId - ID of the split to resize
   * @param newRatio - New ratio (0.0 - 1.0)
   */
  resizeSplit(splitId: string, newRatio: number): PageLayout {
    // Clamp ratio between 0.1 and 0.9
    const clampedRatio = Math.max(0.1, Math.min(0.9, newRatio));

    const splitNode = this._findNodeById(splitId);
    if (!splitNode) return this;

    const metadata = this._metadata.get(splitNode);
    if (!metadata || !metadata.direction) return this;

    // Update ratio in metadata
    metadata.ratio = clampedRatio;

    // Update flex grow for children
    if (splitNode.getChildCount() === 2) {
      const firstChild = splitNode.getChild(0);
      const secondChild = splitNode.getChild(1);
      firstChild.setFlexGrow(clampedRatio);
      secondChild.setFlexGrow(1 - clampedRatio);
    }

    this._invalidateCache();
    return this;
  }

  /**
   * Convert to plain object for serialization (legacy support)
   */
  toConfig(): PageLayoutConfig {
    const rootMetadata = this._metadata.get(this._yogaRoot);
    return {
      id: this._id,
      width: this._width,
      height: this._height,
      rootComponent: rootMetadata?.component,
    };
  }

  /**
   * Compute layout using Yoga
   */
  private _computeLayout(): LayoutNodeBounds[] {
    this._yogaRoot.calculateLayout(this._width, this._height, Yoga.DIRECTION_LTR);
    return this._extractLayout(this._yogaRoot, 0);
  }

  /**
   * Extract layout from Yoga tree
   */
  private _extractLayout(yogaNode: Node, depth: number = 0): LayoutNodeBounds[] {
    const layout = yogaNode.getComputedLayout();
    const metadata = this._metadata.get(yogaNode);
    
    if (!metadata) return [];

    const results: LayoutNodeBounds[] = [];

    // If this is a leaf node (has component), add it to results
    if (metadata.component !== undefined) {
      results.push({
        id: metadata.id,
        bounds: {
          left: layout.left,
          top: layout.top,
          width: layout.width,
          height: layout.height,
        },
        component: metadata.component,
        depth,
      });
    }

    // Recursively extract children
    const childCount = yogaNode.getChildCount();
    for (let i = 0; i < childCount; i++) {
      const child = yogaNode.getChild(i);
      results.push(...this._extractLayout(child, depth + 1));
    }

    return results;
  }

  /**
   * Find a yoga node by its ID
   */
  private _findNodeById(targetId: string, node: Node = this._yogaRoot): Node | null {
    const metadata = this._metadata.get(node);
    if (metadata?.id === targetId) {
      return node;
    }

    const childCount = node.getChildCount();
    for (let i = 0; i < childCount; i++) {
      const child = node.getChild(i);
      const found = this._findNodeById(targetId, child);
      if (found) return found;
    }

    return null;
  }

  /**
   * Find parent of a node
   */
  private _findParent(targetNode: Node, node: Node = this._yogaRoot): Node | null {
    const childCount = node.getChildCount();
    for (let i = 0; i < childCount; i++) {
      const child = node.getChild(i);
      if (child === targetNode) {
        return node;
      }
      const found = this._findParent(targetNode, child);
      if (found) return found;
    }
    return null;
  }

  /**
   * Get child index
   */
  private _getChildIndex(parent: Node, child: Node): number {
    const childCount = parent.getChildCount();
    for (let i = 0; i < childCount; i++) {
      if (parent.getChild(i) === child) {
        return i;
      }
    }
    return -1;
  }

  /**
   * Clone yoga tree structure
   */
  private _cloneYogaTree(
    sourceNode: Node,
    targetNode: Node,
    targetMetadata: Map<Node, NodeMetadata>
  ): void {
    const metadata = this._metadata.get(sourceNode);
    if (metadata) {
      targetMetadata.set(targetNode, { ...metadata });
    }

    // Copy flex properties
    targetNode.setFlexDirection(sourceNode.getFlexDirection());
    targetNode.setFlexGrow(sourceNode.getFlexGrow());

    // Clone children
    const childCount = sourceNode.getChildCount();
    for (let i = 0; i < childCount; i++) {
      const sourceChild = sourceNode.getChild(i);
      const targetChild = Yoga.Node.create();
      this._cloneYogaTree(sourceChild, targetChild, targetMetadata);
      targetNode.insertChild(targetChild, i);
    }
  }
}

/**
 * Multi-page sheet configuration
 */
export interface SheetLayout {
  pages: PageLayout[];
}

/**
 * Bounds of a layout node
 */
export interface Bounds {
  left: number;
  top: number;
  width: number;
  height: number;
}

/**
 * Layout node bounds with metadata
 */
export interface LayoutNodeBounds {
  id: string;
  bounds: Bounds;
  component?: string;
  depth: number;
}
