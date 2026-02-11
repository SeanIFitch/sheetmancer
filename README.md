# D&D Character Sheet Generator (TypeScript)

A fully type-safe, config-driven D&D 5e character sheet generator built with TypeScript.

## 🎯 Features

✅ **Type-Safe** - Full TypeScript with strict type checking  
✅ **Config-Driven** - Declarative layout definitions  
✅ **Theme System** - 4 beautiful themes with customization  
✅ **Modular Components** - Reusable layout components  
✅ **Print-Optimized** - Professional PDF generation  
✅ **Zero Dependencies** - No runtime dependencies  

## 📦 Project Structure

```
src/
├── types.ts           # Type definitions
├── configs.ts         # Layout configurations
├── themes.ts          # Visual themes
├── sheet-engine.ts    # Core rendering engine
├── components.ts      # Layout components
└── app.ts             # Main application
```

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Build
npm run build

# Serve
npm run serve

# Open http://localhost:8080
```

### Development Mode

```bash
npm run dev     # Watch mode
npm run serve   # In another terminal
```

## 📝 Core Interfaces

### CharacterData

```typescript
interface CharacterData {
  name: string;
  class: string;
  level: number;
  race: string;
  // Ability scores
  strength: number;
  dexterity: number;
  constitution: number;
  intelligence: number;
  wisdom: number;
  charisma: number;
  // Combat stats
  armorClass: number;
  hitPointMax: number;
  hitPointCurrent: number;
  // Skills, equipment, features, etc.
}
```

### Theme

```typescript
interface Theme {
  name: string;
  page: { width: string; height: string };
  colors: { background, text, primary, ... };
  typography: { heading, body, label, ... };
  spacing: { page, section, medium, ... };
}
```

### Config

```typescript
interface Config {
  name: string;
  sectionsPerPage: number;
  sections: SectionConfig[];
}
```

## 🔧 Creating Custom Components

```typescript
import { COMPONENTS } from './components';

COMPONENTS.myComponent = {
  render(config, theme, data) {
    return `<div class="sheet-section">...</div>`;
  }
};
```

## 🎨 Available Configs & Themes

**Configs:** `standard`, `minimal`, `detailed`  
**Themes:** `classic`, `modern`, `dark`, `vintage`

## 🛠️ Development

```json
{
  "build": "tsc && rollup -c",
  "dev": "tsc --watch",
  "serve": "npx http-server -p 8080"
}
```

## 🐛 Troubleshooting

**TypeScript Errors:**
```bash
npm install
npx tsc --noEmit
```

**Build Fails:**
```bash
rm -rf dist node_modules package-lock.json
npm install && npm run build
```

**Changes Not Reflected:**
- Hard refresh (Ctrl+Shift+R)
- Check `dist/bundle.js` timestamp
- Clear browser cache

## 📊 Type Safety Benefits

1. Compile-time error detection
2. IDE autocomplete support
3. Safe refactoring
4. Self-documenting code

## 🚀 Deployment

Deploy these files to any static host:
- `index.html`
- `dist/bundle.js`

## 📄 License

MIT - Free to use and modify

## 🤝 Future Enhancements

- [ ] Collaborative editing
- [ ] D&D Beyond import
- [ ] Theme editor UI
- [ ] Multi-language support
- [ ] Accessibility improvements

---

Built with TypeScript for type safety and maintainability.
