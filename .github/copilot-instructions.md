# Copilot Instructions for Sheetmancer

## Project Overview

Sheetmancer is a config-driven D&D 5e character sheet generator built with TypeScript. It focuses on:
- Type safety with strict TypeScript
- Declarative, config-driven layouts
- Modular component system
- Theme-based visual styling
- Zero runtime dependencies
- Print-optimized PDF generation

## Architecture

### Core Components
- `src/types.ts` - TypeScript interfaces and type definitions (~200 lines)
- `src/sheet-engine.ts` - Core rendering engine (~300 lines)
- `src/components.ts` - 10 reusable UI components (~320 lines)
- `src/configs.ts` - 3 layout configurations (~130 lines)
- `src/themes.ts` - 4 visual themes (~340 lines)
- `src/app.ts` - Application logic (~185 lines)

### Design Principles
1. **Config-Driven**: All layouts are declarative configurations
2. **Theme-Based**: Visual styling is separated from layout logic
3. **Type-Safe**: Strict TypeScript with no `any` types
4. **Modular**: Components are pluggable and reusable
5. **Local-First**: No external API calls or services

## Development Setup

### Build System
- **Package Manager**: pnpm (not npm or yarn)
- **Bundler**: Vite
- **TypeScript**: v5.7.3 with strict mode enabled

### Commands
```bash
make install    # Install dependencies
make dev        # Start dev server (localhost:8080)
make build      # Build for production
make preview    # Preview production build
make typecheck  # Run TypeScript type checking
make clean      # Clean build artifacts
```

Or use pnpm directly:
```bash
pnpm install
pnpm dev
pnpm build
pnpm typecheck
```

## Code Style & Conventions

### TypeScript
- Use strict type checking (no `any` types)
- Export interfaces from `types.ts` for reusability
- Use type inference where possible, explicit types for public APIs
- Prefer `interface` over `type` for object shapes

### Components
- Components should have a `render()` method
- Accept `config`, `theme`, and `data` parameters
- Return HTML strings for rendering
- Keep components focused and single-purpose
- Register new components in the `COMPONENTS` object in `components.ts`

### Configurations
- Configs define layout structure declaratively
- Use the `SheetConfig` interface from `types.ts`
- Configs reference components by name
- Keep configs in `configs.ts` unless creating a new system

### Themes
- Themes define visual styling only (colors, fonts, spacing)
- Use the `Theme` interface from `types.ts`
- Keep themes in `themes.ts`
- Support both screen and print media styles

### File Organization
- Keep the flat structure in `src/` (no subdirectories needed for this size)
- One concern per file (types, components, configs, themes, engine, app)
- Import order: types → engine → components → configs → themes → app

## Testing & Validation

### Before Committing
1. Run `make typecheck` to verify TypeScript compiles without errors
2. Run `make build` to ensure production build succeeds
3. Test in browser with `make dev` for visual changes
4. Verify print layout if modifying themes or components

### Manual Testing
- Test all 3 configs: `standard`, `minimal`, `detailed`
- Test all 4 themes: `classic`, `modern`, `dark`, `vintage`
- Verify print preview (browser's print function)

## Common Tasks

### Adding a New Component
1. Define component interface in `types.ts` if needed
2. Add component to `COMPONENTS` object in `components.ts`
3. Implement `render()` method following existing patterns
4. Reference component in config(s) in `configs.ts`
5. Test with `make dev`

### Adding a New Theme
1. Define theme in `themes.ts` following `Theme` interface
2. Include colors, fonts, spacing, borders, and shadows
3. Add to `THEMES` export object
4. Test with all configs

### Adding a New Config
1. Define config in `configs.ts` following `SheetConfig` interface
2. Specify sections and their components
3. Add to `CONFIGS` export object
4. Test with all themes

### Modifying the Engine
1. Changes to `sheet-engine.ts` affect all rendering
2. Maintain backward compatibility with existing components
3. Run full typecheck after engine changes
4. Test with all config/theme combinations

## Dependencies

### Production
- **Zero runtime dependencies** - Keep it this way!
- All rendering is pure TypeScript/HTML/CSS

### Development
- `typescript`: Type checking and compilation
- `vite`: Development server and bundler

### Adding Dependencies
- Avoid adding runtime dependencies unless absolutely necessary
- DevDependencies are acceptable for build/dev tools
- Use pnpm for installation: `pnpm add -D <package>`

## Output & Deployment

### Build Output
- Production build goes to `dist/` directory
- Single-page application with one HTML file
- Assets bundled and minified by Vite
- Compatible with static hosting (GitHub Pages, Netlify, Vercel, etc.)

### Index File
- `index.html` at repository root is the entry point
- References the TypeScript app in `src/app.ts`
- Vite processes and bundles everything

## Best Practices

1. **Keep it Simple**: This is a focused tool, avoid feature creep
2. **Type Everything**: Leverage TypeScript's type system fully
3. **No Magic**: Code should be explicit and easy to follow
4. **Local Data**: Character data stays in memory, no persistence layer
5. **Print-First**: Remember this generates printable sheets
6. **Fast Builds**: Keep build times under 1 second
7. **Small Bundle**: Target bundle size under 100KB

## Security Considerations

- No user authentication or backend
- No data persistence or external API calls
- Client-side only application
- Be cautious with any HTML injection (though we control all inputs)

## Documentation

- Update `README.md` for user-facing changes
- Update `docs/ARCHITECTURE.md` for structural changes
- Keep inline comments minimal but meaningful
- Document complex algorithms or non-obvious decisions
