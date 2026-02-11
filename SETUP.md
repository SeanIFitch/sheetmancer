# Setup Guide - TypeScript Character Sheet Generator

## Prerequisites

- Node.js 16+ and npm installed
- Basic knowledge of TypeScript
- Code editor with TypeScript support (VS Code recommended)

## Installation Steps

### 1. Install Dependencies

```bash
npm install
```

This installs:
- `typescript` - TypeScript compiler
- `rollup` - Module bundler
- `@rollup/plugin-typescript` - TypeScript plugin for Rollup
- `@rollup/plugin-node-resolve` - Module resolution
- `tslib` - TypeScript runtime library

### 2. Verify TypeScript Installation

```bash
npx tsc --version
# Should output: Version 5.3.3 (or similar)
```

### 3. Build the Project

```bash
npm run build
```

This will:
1. Compile TypeScript files (`*.ts`) to JavaScript in `dist/`
2. Generate type declaration files (`*.d.ts`)
3. Bundle all modules into `dist/bundle.js`
4. Create source maps for debugging

### 4. Verify Build Output

```bash
ls -la dist/
```

You should see:
```
dist/
├── app.d.ts
├── app.js
├── bundle.js
├── bundle.js.map
├── components.d.ts
├── components.js
├── configs.d.ts
├── configs.js
├── sheet-engine.d.ts
├── sheet-engine.js
├── themes.d.ts
├── themes.js
└── types.d.ts
```

### 5. Start Development Server

```bash
npm run serve
```

Opens HTTP server on `http://localhost:8080`

### 6. Open in Browser

Navigate to `http://localhost:8080/index.html`

## Development Workflow

### Watch Mode

For active development, run TypeScript compiler in watch mode:

```bash
npm run dev
```

This automatically recompiles when you save TypeScript files.

In another terminal, run the server:

```bash
npm run serve
```

### Making Changes

1. Edit TypeScript files (`.ts`)
2. Save changes
3. If in watch mode, wait for recompilation
4. If not, run `npm run build`
5. Refresh browser to see changes

### Testing Changes

1. Make a change to `components.ts`
2. Build: `npm run build`
3. Refresh browser
4. Test the component

## Project Structure Explained

```
├── types.ts              → Type definitions for all interfaces
├── configs.ts            → Layout configuration objects
├── themes.ts             → Visual theme objects
├── sheet-engine.ts       → Core rendering class
├── components.ts         → Component implementations
├── app.ts                → Main application class
├── index.html            → HTML entry point
├── package.json          → NPM configuration
├── tsconfig.json         → TypeScript compiler options
└── rollup.config.js      → Bundler configuration
```

## TypeScript Configuration

### `tsconfig.json` Explained

```json
{
  "compilerOptions": {
    "target": "ES2020",           // Output modern JavaScript
    "module": "ES2020",           // Use ES modules
    "lib": ["ES2020", "DOM"],     // Include DOM types
    "outDir": "./dist",           // Output directory
    "strict": true,               // Enable all strict checks
    "esModuleInterop": true,      // Better CommonJS interop
    "sourceMap": true,            // Generate source maps
    "declaration": true           // Generate .d.ts files
  }
}
```

Key settings:
- **strict: true** - Maximum type safety
- **sourceMap: true** - Debug TypeScript in browser
- **declaration: true** - Generate type declarations

### Rollup Configuration

```javascript
export default {
  input: 'app.ts',              // Entry point
  output: {
    file: 'dist/bundle.js',     // Output bundle
    format: 'iife',             // Immediately-invoked function
    sourcemap: true             // Include source maps
  },
  plugins: [
    typescript(),               // Compile TypeScript
    nodeResolve()              // Resolve imports
  ]
};
```

## Common Issues and Solutions

### Issue: TypeScript Errors After Installation

**Symptom:**
```
error TS2307: Cannot find module 'X' or its corresponding type declarations
```

**Solution:**
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Issue: Build Fails

**Symptom:**
```
[!] (plugin typescript) Error: Could not resolve module
```

**Solution:**
```bash
# Check TypeScript files compile individually
npx tsc --noEmit

# If errors, fix TypeScript issues
# Then rebuild
npm run build
```

### Issue: Changes Not Reflected in Browser

**Symptom:**
Browser shows old version after making changes.

**Solution:**
1. Hard refresh browser (Ctrl+Shift+R / Cmd+Shift+R)
2. Check if build succeeded: `ls -la dist/bundle.js`
3. Verify file timestamp: `ls -la dist/bundle.js`
4. Clear browser cache

### Issue: Source Maps Not Working

**Symptom:**
Can't debug TypeScript in browser DevTools.

**Solution:**
1. Ensure source maps are generated: `ls dist/*.map`
2. Check browser DevTools settings (enable source maps)
3. Rebuild: `npm run build`

### Issue: Module Not Found at Runtime

**Symptom:**
```
Uncaught ReferenceError: CONFIGS is not defined
```

**Solution:**
This was the original issue. Fix:

1. Ensure all files are built:
```bash
npm run build
ls dist/  # Should show all .js files
```

2. Check HTML imports correct file:
```html
<script type="module" src="./dist/bundle.js"></script>
```

3. Verify Rollup bundled everything:
```bash
grep "CONFIGS" dist/bundle.js  # Should find CONFIGS
```

## IDE Setup (VS Code)

### Recommended Extensions

1. **ESLint** - Linting
2. **Prettier** - Code formatting
3. **TypeScript Importer** - Auto-import
4. **Path Intellisense** - File path autocomplete

### VS Code Settings

Create `.vscode/settings.json`:

```json
{
  "typescript.tsdk": "node_modules/typescript/lib",
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "typescript.preferences.importModuleSpecifier": "relative"
}
```

### Debug Configuration

Create `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "chrome",
      "request": "launch",
      "name": "Launch Chrome",
      "url": "http://localhost:8080",
      "webRoot": "${workspaceFolder}",
      "sourceMaps": true
    }
  ]
}
```

## Build Performance

### Build Time Benchmarks

On typical hardware:
- Initial build: ~3-5 seconds
- Incremental rebuild: ~1-2 seconds
- Watch mode rebuild: ~500ms-1s

### Optimization Tips

1. **Use watch mode for development**
```bash
npm run dev  # Auto-recompile on save
```

2. **Skip type checking in dev mode**
```json
// Add to package.json
"scripts": {
  "dev:fast": "tsc --noCheck --watch"
}
```

3. **Use incremental compilation**
```json
// Add to tsconfig.json
"compilerOptions": {
  "incremental": true
}
```

## Testing the Build

### Manual Testing Checklist

After building:

1. [ ] Open `index.html` in browser
2. [ ] Select different configs - should render
3. [ ] Select different themes - should apply styles
4. [ ] Change character data - should update
5. [ ] Click "Generate Sheet" - should regenerate
6. [ ] Click "Print to PDF" - should open print dialog
7. [ ] Click "Export Config" - should download JSON
8. [ ] Check browser console - no errors

### Automated Tests

To add automated testing:

```bash
# Install testing framework
npm install --save-dev jest @types/jest ts-jest

# Create test file
touch sheet-engine.test.ts
```

Example test:
```typescript
import { SheetEngine } from './sheet-engine';

describe('SheetEngine', () => {
  it('calculates modifier correctly', () => {
    expect(SheetEngine.calculateModifier(16)).toBe(3);
    expect(SheetEngine.calculateModifier(10)).toBe(0);
    expect(SheetEngine.calculateModifier(8)).toBe(-1);
  });
});
```

## Production Build

### Optimization

For production, minify the bundle:

```bash
# Install terser
npm install --save-dev @rollup/plugin-terser

# Update rollup.config.js
import terser from '@rollup/plugin-terser';

export default {
  // ... existing config
  plugins: [
    typescript(),
    nodeResolve(),
    terser()  // Minify
  ]
};
```

### Build for Production

```bash
NODE_ENV=production npm run build
```

## Deployment

### Static Hosting

Deploy these files to any static host:
- `index.html`
- `dist/bundle.js`
- `dist/bundle.js.map` (optional)

### Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build
npm run build

# Deploy
netlify deploy --prod
```

### Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

## Next Steps

1. **Explore the code** - Start with `app.ts`
2. **Create a custom component** - Add to `components.ts`
3. **Design a custom theme** - Add to `themes.ts`
4. **Build a custom config** - Add to `configs.ts`

## Resources

- [Project README](README.md)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Rollup Guide](https://rollupjs.org/guide/en/)

## Support

For issues with:
- **TypeScript compilation** - Check `tsconfig.json`
- **Module bundling** - Check `rollup.config.js`
- **Runtime errors** - Check browser console
- **Type errors** - Run `npx tsc --noEmit`

---

Happy coding! 🎲⚔️
