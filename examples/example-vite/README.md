# Vite example using StyleX

This example demonstrates how to use StyleX with Vite, including proper handling of StyleX styles in published dependencies.

## The Problem

When using Vite with StyleX, published dependencies (npm packages in `node_modules`) containing uncompiled `stylex.create()` calls cause runtime errors because Vite doesn't transform dependencies by default.

## The Solution

Use `@stylexjs/vite-plugin` which properly handles StyleX dependencies:

```javascript
// vite.config.js
import { defineConfig } from 'vite';
import stylexPlugin from '@stylexjs/vite-plugin';

export default defineConfig({
  plugins: [
    stylexPlugin({
      fileName: 'stylex.css',
    }),
  ],
});
```

## Running the Example

```bash
npm install
npm run dev
```

## Key Benefits

- ✅ Works with published dependencies containing StyleX styles
- ✅ Proper dependency optimization for StyleX packages  
- ✅ Vite-specific caching optimizations
- ✅ Compatible with all StyleX features
