# D&D Character Sheet Generator (TypeScript)

A fully type-safe, config-driven D&D 5e character sheet generator built with TypeScript.

## 🎯 Features

✅ **Type-Safe** - Full TypeScript implementation with strict type checking  
✅ **Config-Driven** - Define layouts declaratively  
✅ **Theme System** - 4 beautiful themes with full customization  
✅ **Modular Components** - Reusable, type-safe layout components  
✅ **Automatic Pagination** - Smart content flow across pages  
✅ **Print-Optimized** - Professional PDF generation  
✅ **Zero Dependencies** - No runtime dependencies  
✅ **Local Execution** - Runs entirely in the browser  

## 📦 Project Structure

```
.
├── types.ts              # TypeScript type definitions
├── configs.ts            # Layout configuration templates
├── themes.ts             # Visual theme definitions
├── sheet-engine.ts       # Core rendering engine
├── components.ts         # Reusable layout components
├── app.ts                # Main application logic
├── index.html            # Main HTML entry point
├── standalone.html       # Single-file version (no build required)
├── package.json          # NPM dependencies and scripts
├── tsconfig.json         # TypeScript configuration
├── rollup.config.js      # Bundler configuration
└── README.md             # This file
```

## 🚀 Quick Start

### Option 1: Build and Run

```bash
# Install dependencies
npm install

# Build the TypeScript files
npm run build

# Serve the application
npm run serve

# Open http://localhost:8080 in your browser
```

### Option 2: Development Mode

```bash
# Watch for changes and rebuild
npm run dev

# In another terminal, serve the files
npm run serve
```

### Option 3: Standalone (No Build Required)

After building once, you can use `standalone.html` which requires no additional setup.

## 📝 Build Process

The build process:
1. **TypeScript Compilation** - Compiles `.ts` files to ES modules
2. **Rollup Bundling** - Bundles modules into a single `dist/bundle.js`
3. **Source Maps** - Generates source maps for debugging

Build outputs:
- `dist/bundle.js` - Main application bundle
- `dist/bundle.js.map` - Source map
- `dist/*.d.ts` - Type declaration files

## 🎨 Type Definitions

### CharacterData Interface

```typescript
interface CharacterData {
  // Basic Info
  name: string;
  class: string;
  level: number;
  race: string;
  background: string;
  alignment: string;
  experiencePoints: number;

  // Ability Scores
  strength: number;
  dexterity: number;
  constitution: number;
  intelligence: number;
  wisdom: number;
  charisma: number;

  // Combat Stats
  proficiencyBonus: number;
  armorClass: number;
  initiative: number;
  speed: number;
  hitPointMax: number;
  hitPointCurrent: number;
  hitDice: string;
  deathSaves: {
    successes: number;
    failures: number;
  };

  // Skills & Saves (optional)
  skills?: Record<string, { proficient: boolean }>;
  savingThrows?: Record<string, { proficient: boolean }>;

  // Equipment & Features
  equipment: string[];
  features: string[];

  // Additional fields
  [key: string]: any;
}
```

### Theme Interface

```typescript
interface Theme {
  name: string;
  page: { width: string; height: string };
  colors: {
    background: string;
    text: string;
    primary: string;
    secondary: string;
    border: string;
    fieldBackground: string;
    statBackground: string;
  };
  typography: {
    heading: { family: string; size: string; weight: string; /* ... */ };
    body: { family: string; size: string };
    label: { /* ... */ };
    value: { /* ... */ };
    stat: { /* ... */ };
    modifier: { /* ... */ };
  };
  spacing: { /* ... */ };
  borders: { /* ... */ };
  backgrounds: { /* ... */ };
  decorative: { /* ... */ };
}
```

### Config Interface

```typescript
interface Config {
  name: string;
  sectionsPerPage: number;
  sections: SectionConfig[];
}

interface SectionConfig {
  component: string;
  showHeader?: boolean;
  title?: string;
  [key: string]: any;
}
```

### Component Interface

```typescript
interface Component {
  render(config: SectionConfig, theme: Theme, data: CharacterData): string;
}
```

## 🔧 Creating Custom Components

```typescript
import { Component, SectionConfig, Theme, CharacterData } from './types';
import { COMPONENTS } from './components';

COMPONENTS.myCustomComponent = {
  render(config: SectionConfig, theme: Theme, data: CharacterData): string {
    // Type-safe access to all properties
    const title = config.title || 'Default Title';
    const primaryColor = theme.colors.primary;
    const charName = data.name;

    return `
      <div class="sheet-section">
        <div class="section-header" style="color: ${primaryColor}">
          ${title}
        </div>
        <div class="content">
          Character: ${charName}
        </div>
      </div>
    `;
  }
};
```

## 🎨 Creating Custom Themes

```typescript
import { Theme } from './types';
import { THEMES } from './themes';

THEMES.myTheme = {
  name: 'My Custom Theme',
  page: {
    width: '8.5in',
    height: '11in'
  },
  colors: {
    background: '#ffffff',
    text: '#000000',
    primary: '#ff0000',
    secondary: '#0000ff',
    border: '#cccccc',
    fieldBackground: '#f5f5f5',
    statBackground: '#e8e8e8'
  },
  // ... rest of theme properties
};
```

## 🏗️ Architecture

### SheetEngine Class

The core rendering engine:

```typescript
class SheetEngine {
  constructor(components: Record<string, Component>);
  
  generate(config: Config, theme: Theme, data: CharacterData): {
    html: string;
    styles: string;
  };
  
  static calculateModifier(score: number): number;
  static formatModifier(modifier: number): string;
}
```

### CharacterSheetApp Class

Main application controller:

```typescript
class CharacterSheetApp {
  constructor();
  
  private initialize(): void;
  private setupEventListeners(): void;
  private getCharacterData(): CharacterData;
  public regenerateSheet(): void;
  private exportConfig(): void;
}
```

## 📚 Available Configs

### Standard 5e Sheet
Full-featured character sheet with all standard D&D 5e fields.

```typescript
CONFIGS.standard
```

### Minimal Sheet
Streamlined sheet with essential information only.

```typescript
CONFIGS.minimal
```

### Detailed Sheet
Extended sheet with additional sections for backstory and notes.

```typescript
CONFIGS.detailed
```

## 🎨 Available Themes

### Classic Parchment
Traditional fantasy aesthetic with serif fonts and warm tones.

```typescript
THEMES.classic
```

### Modern Clean
Contemporary design with sans-serif fonts and clean lines.

```typescript
THEMES.modern
```

### Dark Fantasy
Dramatic dark theme with golden accents.

```typescript
THEMES.dark
```

### Vintage Manuscript
Gothic-inspired design with ornate typography.

```typescript
THEMES.vintage
```

## 🔍 Type Safety Benefits

1. **Compile-Time Errors** - Catch bugs before runtime
2. **IntelliSense Support** - Full autocomplete in IDEs
3. **Refactoring Safety** - Rename and restructure with confidence
4. **Documentation** - Types serve as inline documentation
5. **Maintainability** - Easier to understand and modify code

## 🛠️ Development Workflow

### 1. Make Changes
Edit TypeScript files in your IDE with full type checking.

### 2. Build
```bash
npm run build
```

### 3. Test
Open `index.html` in a browser and test your changes.

### 4. Debug
Use browser DevTools with source maps for debugging TypeScript directly.

## 📖 NPM Scripts

```json
{
  "build": "tsc && rollup -c",          // Full build
  "build:tsc": "tsc",                    // TypeScript only
  "dev": "tsc --watch",                  // Watch mode
  "serve": "npx http-server -p 8080",   // Start server
  "start": "npm run build && npm run serve"  // Build and serve
}
```

## 🐛 Troubleshooting

### TypeScript Errors

**Error: Cannot find module**
```bash
# Install dependencies
npm install
```

**Error: Type errors during build**
```bash
# Check TypeScript configuration
cat tsconfig.json

# Run type checker
npx tsc --noEmit
```

### Build Errors

**Rollup bundling fails**
```bash
# Clean and rebuild
rm -rf dist
npm run build
```

### Runtime Errors

**CONFIGS/THEMES not defined**
- Ensure all TypeScript files are compiled
- Check `dist/` directory exists and contains JS files
- Verify import paths in HTML file

## 🚀 Deployment

### Static Hosting

After building, deploy these files:
- `index.html`
- `dist/bundle.js`
- `dist/bundle.js.map` (optional)

No server-side code required!

### GitHub Pages

```bash
# Build the project
npm run build

# Commit dist folder
git add dist/
git commit -m "Build for deployment"

# Push to gh-pages branch
git subtree push --prefix dist origin gh-pages
```

## 📊 File Sizes

| File | Size (uncompressed) |
|------|---------------------|
| types.ts | ~3 KB |
| configs.ts | ~2 KB |
| themes.ts | ~8 KB |
| sheet-engine.ts | ~5 KB |
| components.ts | ~10 KB |
| app.ts | ~3 KB |
| **Total TS** | **~31 KB** |
| dist/bundle.js | ~35 KB |
| dist/bundle.js.map | ~45 KB |

## 🔒 Type Safety Examples

### Before (JavaScript)
```javascript
// Runtime error - typo in property name
const score = data.strenght; // undefined

// No autocomplete
const mod = calculateModifier(score);
```

### After (TypeScript)
```typescript
// Compile-time error
const score = data.strenght;
//                  ^^^^^^^^ Property 'strenght' does not exist

// Full autocomplete and type checking
const score = data.strength; // ✓
const mod = SheetEngine.calculateModifier(score); // ✓
```

## 🎓 Learning Resources

- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [TypeScript Deep Dive](https://basarat.gitbook.io/typescript/)
- [Rollup Documentation](https://rollupjs.org/)

## 📄 License

This is a demonstration project. Feel free to use and modify for your needs.

## 🤝 Contributing

This is a reference implementation. Key areas for extension:
1. Additional components (spell slots, inventory management)
2. More themes
3. Dynamic pagination based on content measurement
4. PDF generation without print dialog
5. Character data persistence (localStorage/IndexedDB)

## 🔮 Future Enhancements

- [ ] Real-time collaborative editing
- [ ] Character import from D&D Beyond API
- [ ] Custom font uploads
- [ ] Theme editor UI
- [ ] Config editor UI
- [ ] Multi-language support
- [ ] Accessibility improvements (WCAG 2.1 AA)

---

Built with TypeScript for type safety and maintainability.
