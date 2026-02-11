# Sheetmancer

Config-driven D&D 5e character sheet generator built with TypeScript.

## Features

- **Type-Safe**: Full TypeScript with strict type checking
- **Config-Driven**: Declarative layout definitions
- **Theme System**: 4 beautiful themes
- **Print-Optimized**: Professional PDF generation
- **Zero Dependencies**: No runtime dependencies

## Quick Start

```bash
# Install dependencies
make install

# Start dev server
make dev

# Build for production
make build

# Preview production build
make preview
```

## Project Structure

```
src/
├── types.ts           # Type definitions
├── configs.ts         # Layout configurations
├── themes.ts          # Visual themes
├── sheet-engine.ts    # Core rendering engine
├── components.ts      # Layout components
└── app.ts             # Main application
```

## Development

### Prerequisites
- Node.js 18+
- pnpm

### Commands
- `make install` - Install dependencies
- `make dev` - Start development server (port 8080)
- `make build` - Build for production
- `make preview` - Preview production build
- `make clean` - Clean build artifacts

### Creating Custom Components

```typescript
import { COMPONENTS } from './components';

COMPONENTS.myComponent = {
  render(config, theme, data) {
    return `<div class="sheet-section">...</div>`;
  }
};
```

## Available Configs & Themes

**Configs:** `standard`, `minimal`, `detailed`  
**Themes:** `classic`, `modern`, `dark`, `vintage`

## License

MIT
