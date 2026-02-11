# Architecture

## Overview

Config-driven D&D 5e character sheet generator with modular components and theme system.

## Core Principles

1. **Config-Driven**: Declarative layout definitions
2. **Theme-Based**: Visual styling separated from layout
3. **Type-Safe**: Strict TypeScript
4. **Modular**: Pluggable components
5. **Local-First**: No external services

## System Components

```
src/
├── types.ts           # TypeScript interfaces
├── sheet-engine.ts    # Core rendering engine
├── components.ts      # Reusable UI components (10)
├── configs.ts         # Layout configurations (3)
├── themes.ts          # Visual themes (4)
└── app.ts             # Application logic
```

## Build System

TypeScript → Vite → Production bundle

## Deployment

Static files only:
- `index.html`
- `dist/assets/*.js`

Compatible with GitHub Pages, Netlify, Vercel, etc.
