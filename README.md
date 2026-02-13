# Sheetmancer

Config-driven D&D 5e character sheet generator

## Quick Start

```bash
pnpm install
pnpm vite
```

## Features

### Edge-Centered Drag Split Heuristic

The layout engine uses an intelligent edge-centered heuristic to determine how panels should split when components are dragged:

- **Dynamic Detection**: Calculates the center point of each edge (top, bottom, left, right)
- **Closest Edge Wins**: Determines split direction based on which edge center is nearest to the cursor
- **No Hardcoded Thresholds**: Works with any panel size or position
- **Intuitive Behavior**: 
  - Drag near the top edge → Vertical split with new panel above
  - Drag near the bottom edge → Vertical split with new panel below
  - Drag near the left edge → Horizontal split with new panel on the left
  - Drag near the right edge → Horizontal split with new panel on the right

The implementation uses Euclidean distance to find the closest edge center, making the split behavior predictable and consistent across different panel sizes.
