import Yoga, { Edge } from 'yoga-layout';

/**
 * Layout configuration for a single page (8.5" x 11" at 96dpi)
 */
export interface PageLayoutConfig {
  id: string;
  width: number;  // 816 (8.5 * 96)
  height: number; // 1056 (11 * 96)
  root: LayoutNode;
}

/**
 * PageLayout class - manages page layout with methods for manipulation
 */
export class PageLayout {
  private _id: string;
  private _width: number;
  private _height: number;
  private _root: LayoutNode;
  private _layoutCache: LayoutNodeBounds[] | null = null;

  constructor(config: PageLayoutConfig) {
    this._id = config.id;
    this._width = config.width;
    this._height = config.height;
    this._root = config.root;
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

  get root(): LayoutNode {
    return this._root;
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
   * Invalidate the layout cache
   */
  private _invalidateCache(): void {
    this._layoutCache = null;
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
   * @returns New PageLayout instance with the split applied
   */
  splitNode(nodeId: string, edge: Edge, component: string): PageLayout {
    const newRoot = this._replaceNode(this._root, nodeId, (node) => {
      if (node.type !== 'leaf') return node;

      // If this is an initial component (empty string), replace it directly
      if (node.component === '') {
        return {
          type: 'leaf',
          id: node.id,
          component: component,
        };
      }

      // Create new leaf for the new component
      const newLeaf: LeafNode = {
        type: 'leaf',
        id: crypto.randomUUID(),
        component: component,
      };

      const direction = edge === Edge.Top || edge === Edge.Bottom ? 'vertical' : 'horizontal';
      const isAfter = edge === Edge.Bottom || edge === Edge.Right;

      const newSplit: SplitNode = {
        type: 'split',
        id: crypto.randomUUID(),
        direction: direction,
        ratio: 0.5,
        children: isAfter ? [node, newLeaf] : [newLeaf, node],
      };

      return newSplit;
    });

    if (!newRoot) {
      return this;
    }

    return new PageLayout({
      id: this._id,
      width: this._width,
      height: this._height,
      root: newRoot,
    });
  }

  /**
   * Resize a split by updating its ratio
   * @param splitId - ID of the split to resize
   * @param newRatio - New ratio (0.0 - 1.0)
   * @returns New PageLayout instance with the updated ratio
   */
  resizeSplit(splitId: string, newRatio: number): PageLayout {
    // Clamp ratio between 0.1 and 0.9
    const clampedRatio = Math.max(0.1, Math.min(0.9, newRatio));

    const newRoot = this._updateNodeRatio(this._root, splitId, clampedRatio);

    if (!newRoot) {
      return this;
    }

    return new PageLayout({
      id: this._id,
      width: this._width,
      height: this._height,
      root: newRoot,
    });
  }

  /**
   * Convert to plain object for serialization.
   * Returns a deep copy to ensure immutability of internal state.
   */
  toConfig(): PageLayoutConfig {
    return {
      id: this._id,
      width: this._width,
      height: this._height,
      root: structuredClone(this._root),
    };
  }

  /**
   * Compute layout using Yoga
   */
  private _computeLayout(): LayoutNodeBounds[] {
    const yogaRoot = this._buildYogaTree(this._root);

    yogaRoot.calculateLayout(this._width, this._height, Yoga.DIRECTION_LTR);

    const results = this._extractLayout(yogaRoot, this._root, 0);

    yogaRoot.freeRecursive();

    return results;
  }

  /**
   * Build Yoga tree from layout node
   */
  private _buildYogaTree(node: LayoutNode): Yoga.Node {
    const yogaNode = Yoga.Node.create();

    if (node.type === 'leaf') {
      yogaNode.setFlexGrow(1);
      return yogaNode;
    }

    // Split node - set flex direction and create children
    if (node.direction === 'horizontal') {
      yogaNode.setFlexDirection(Yoga.FLEX_DIRECTION_ROW);
    } else {
      yogaNode.setFlexDirection(Yoga.FLEX_DIRECTION_COLUMN);
    }

    // Create children with ratio via flexGrow
    const firstChild = this._buildYogaTree(node.children[0]);
    firstChild.setFlexGrow(node.ratio);
    yogaNode.insertChild(firstChild, 0);

    const secondChild = this._buildYogaTree(node.children[1]);
    secondChild.setFlexGrow(1 - node.ratio);
    yogaNode.insertChild(secondChild, 1);

    return yogaNode;
  }

  /**
   * Extract layout from Yoga tree
   */
  private _extractLayout(
    yogaNode: Yoga.Node,
    configNode: LayoutNode,
    depth: number = 0
  ): LayoutNodeBounds[] {
    const layout = yogaNode.getComputedLayout();

    if (configNode.type === 'leaf') {
      return [
        {
          id: configNode.id,
          bounds: {
            left: layout.left,
            top: layout.top,
            width: layout.width,
            height: layout.height,
          },
          component: configNode.component,
          depth,
        },
      ];
    }

    // Split node - recursively extract children
    const results: LayoutNodeBounds[] = [];

    const firstChildYoga = yogaNode.getChild(0);
    results.push(...this._extractLayout(firstChildYoga, configNode.children[0], depth + 1));

    const secondChildYoga = yogaNode.getChild(1);
    results.push(...this._extractLayout(secondChildYoga, configNode.children[1], depth + 1));

    return results;
  }

  /**
   * Recursively replace a node.
   * @param node - Node to search in
   * @param targetId - ID of node to replace
   * @param replacer - Function that receives a cloned node and returns a new node
   * @returns New tree with node replaced, or null if not found
   */
  private _replaceNode(
    node: LayoutNode,
    targetId: string,
    replacer: (node: LayoutNode) => LayoutNode
  ): LayoutNode | null {
    if (node.id === targetId) {
      // Clone before passing to replacer to ensure immutability
      return replacer(structuredClone(node));
    }

    if (node.type === 'split') {
      const newFirst = this._replaceNode(node.children[0], targetId, replacer);
      if (newFirst) {
        const newNode = structuredClone(node);
        newNode.children[0] = newFirst;
        return newNode;
      }

      const newSecond = this._replaceNode(node.children[1], targetId, replacer);
      if (newSecond) {
        const newNode = structuredClone(node);
        newNode.children[1] = newSecond;
        return newNode;
      }
    }

    return null;
  }

  /**
   * Recursively update a split node's ratio
   */
  private _updateNodeRatio(
    node: LayoutNode,
    splitId: string,
    newRatio: number
  ): LayoutNode | null {
    if (node.id === splitId && node.type === 'split') {
      const newNode = structuredClone(node);
      newNode.ratio = newRatio;
      return newNode;
    }

    if (node.type === 'split') {
      const updatedFirstChild = this._updateNodeRatio(node.children[0], splitId, newRatio);
      if (updatedFirstChild) {
        const newNode = structuredClone(node);
        newNode.children[0] = updatedFirstChild;
        return newNode;
      }

      const updatedSecondChild = this._updateNodeRatio(node.children[1], splitId, newRatio);
      if (updatedSecondChild) {
        const newNode = structuredClone(node);
        newNode.children[1] = updatedSecondChild;
        return newNode;
      }
    }

    return null;
  }
}

/**
 * Layout node - either a split (container) or leaf (component slot)
 */
export type LayoutNode = SplitNode | LeafNode;

/**
 * Split node - divides space into two children
 */
export interface SplitNode {
  type: 'split';
  id: string;
  direction: 'horizontal' | 'vertical';
  ratio: number; // 0.0 - 1.0, first child gets this ratio
  children: [LayoutNode, LayoutNode]; // Always exactly 2
}

/**
 * Leaf node - represents a component
 */
export interface LeafNode {
  type: 'leaf';
  id: string;
  component: string | undefined;
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
