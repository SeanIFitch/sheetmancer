# Setup Guide

## Prerequisites

- Node.js 16+ and npm
- TypeScript-capable code editor (VS Code recommended)

## Quick Setup

```bash
# 1. Install dependencies
npm install

# 2. Build
npm run build

# 3. Serve
npm run serve

# 4. Open http://localhost:8080
```

## Development Workflow

### Watch Mode
```bash
npm run dev     # Auto-recompile on save
npm run serve   # In another terminal
```

### Manual Build
```bash
npm run build   # Full build: TypeScript + Rollup
```

## Project Structure

```
src/
├── types.ts           # Type definitions
├── configs.ts         # Layout configurations  
├── themes.ts          # Visual themes
├── sheet-engine.ts    # Core engine
├── components.ts      # UI components
└── app.ts             # Main application

dist/                  # Build output
├── bundle.js          # Main bundle
├── bundle.js.map      # Source map
└── *.d.ts             # Type declarations
```

## Configuration Files

### TypeScript (`tsconfig.json`)
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "strict": true,
    "outDir": "./dist",
    "sourceMap": true
  }
}
```

### Rollup (`rollup.config.js`)
Bundles TypeScript modules into single `dist/bundle.js` file.

## Common Issues

### TypeScript Errors
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Build Fails
```bash
# Type check without emit
npx tsc --noEmit

# Clean rebuild
rm -rf dist && npm run build
```

### Changes Not Reflected
1. Hard refresh browser (Ctrl+Shift+R)
2. Check `dist/bundle.js` timestamp
3. Verify build succeeded
4. Clear browser cache

### Source Maps Not Working
```bash
# Ensure source maps generated
ls dist/*.map

# Rebuild
npm run build
```

## IDE Setup (VS Code)

### Recommended Extensions
- ESLint
- Prettier
- TypeScript Importer

### Settings (`.vscode/settings.json`)
```json
{
  "typescript.tsdk": "node_modules/typescript/lib",
  "editor.formatOnSave": true
}
```

## Build Performance

- Initial build: ~3-5 seconds
- Incremental rebuild: ~1-2 seconds
- Watch mode: ~500ms-1s

### Optimization
```json
// tsconfig.json
{
  "compilerOptions": {
    "incremental": true
  }
}
```

## Production Build

```bash
# Standard build
npm run build

# With minification (requires @rollup/plugin-terser)
NODE_ENV=production npm run build
```

## Deployment

Deploy to static host:
- `index.html`
- `dist/bundle.js`

### Netlify
```bash
netlify deploy --prod
```

### Vercel
```bash
vercel --prod
```

## Resources

- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Rollup Guide](https://rollupjs.org/guide/)
- [Project README](README.md)

---

Happy coding! 🎲
