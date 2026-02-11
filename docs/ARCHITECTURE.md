# Architecture Documentation

## System Overview

The Sheetmancer D&D Character Sheet Generator is a config-driven system that generates printable character sheets for D&D 5e. The architecture follows a clean separation of concerns with modular, reusable components.

## Core Principles

1. **Config-Driven**: All layouts are defined declaratively through configuration objects
2. **Theme-Based**: Visual styling is completely separated from layout logic
3. **Type-Safe**: Full TypeScript implementation with strict type checking
4. **Modular**: Components can be added, removed, or modified without affecting others
5. **Deterministic**: Same input always produces same output
6. **Local-First**: No external services or APIs required

## Requirements Coverage

### Functional Requirements ✓

1. ✓ System generates printable, page-sized character sheet layout locally
2. ✓ Output is page-formatted HTML document for local printing to PDF
3. ✓ Layout defined declaratively via config (no explicit coordinates)
4. ✓ Config defines document structure (sections, components, fields)
5. ✓ Themes control layout, spacing, typography, and styling
6. ✓ Changing config/theme regenerates sheet without code changes
7. ✓ Support reusable layout components
8. ✓ Layout supports automatic pagination
9. ✓ System supports theming via configuration and assets

### Non-Functional Requirements ✓

1. ✓ Runs locally with no external services required
2. ✓ Deterministic output for identical config + theme inputs
3. ✓ Fast regeneration for iterative editing
4. ✓ Layout uses relative flow and container-based layout rules
5. ✓ Modular architecture for easy component/theme addition
6. ✓ Visual customization through theme config only

## Build System

TypeScript → Rollup → Browser-ready bundle
- Input: `src/**/*.ts`
- Output: `dist/bundle.js`
- Strict type checking enabled
- Source maps for debugging

## Deployment

Static hosting only:
- `index.html`
- `dist/bundle.js`

Compatible with GitHub Pages, Netlify, Vercel, etc.
