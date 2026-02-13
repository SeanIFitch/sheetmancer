/**
 * Layout configuration for a single page (8.5" x 11" at 96dpi)
 */
export interface PageLayout {
  id: string;
  width: number;  // 816 (8.5 * 96)
  height: number; // 1056 (11 * 96)
  root: LayoutNode;
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
 * Leaf node - component placeholder
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
