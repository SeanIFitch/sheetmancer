import Yoga, {Node} from 'yoga-layout';
import type { LayoutNode, PageLayout } from '../types/layout';

/**
 * Convert layout tree to Yoga nodes and calculate layout
 */
export function calculateLayout(page: PageLayout): LayoutResult[] {
  const yogaRoot = buildYogaTree(page.root);
  
  yogaRoot.calculateLayout(page.width, page.height, Yoga.DIRECTION_LTR);
  
  const results = extractLayout(yogaRoot, page.root, 0);
  
  yogaRoot.freeRecursive();
  
  return results;
}

export interface LayoutResult {
  id: string;
  bounds: { left: number; top: number; width: number; height: number };
  placeholder?: string;
  depth: number;
}

function buildYogaTree(node: LayoutNode): Node {
  const yogaNode = Yoga.Node.create();
  
  if (node.type === 'leaf') {
    // Leaf nodes just take up space with flex grow
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
  const firstChild = buildYogaTree(node.children[0]);
  firstChild.setFlexGrow(node.ratio);
  yogaNode.insertChild(firstChild, 0);
  
  const secondChild = buildYogaTree(node.children[1]);
  secondChild.setFlexGrow(1 - node.ratio);
  yogaNode.insertChild(secondChild, 1);
  
  return yogaNode;
}

function extractLayout(yogaNode: Node, configNode: LayoutNode, depth: number = 0): LayoutResult[] {
  const layout = yogaNode.getComputedLayout();
  
  if (configNode.type === 'leaf') {
    // Leaf node - return single result
    return [{
      id: configNode.id,
      bounds: {
        left: layout.left,
        top: layout.top,
        width: layout.width,
        height: layout.height,
      },
      placeholder: configNode.placeholder,
      depth,
    }];
  }
  
  // Split node - recursively extract children
  const results: LayoutResult[] = [];
  
  const firstChildYoga = yogaNode.getChild(0);
  results.push(...extractLayout(firstChildYoga, configNode.children[0], depth + 1));
  
  const secondChildYoga = yogaNode.getChild(1);
  results.push(...extractLayout(secondChildYoga, configNode.children[1], depth + 1));
  
  return results;
}
