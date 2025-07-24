# Vite example using StyleX

This example demonstrates how to use StyleX with Vite using the recommended postcss + babel approach, including proper handling of StyleX styles in published dependencies.

## The Problem

When using Vite with StyleX, published dependencies (npm packages in `node_modules`) containing uncompiled `stylex.create()` calls cause runtime errors because Vite doesn't transform dependencies by default.

## The Solution

Use `@stylexjs/vite-plugin` which configures the recommended postcss + babel approach:

```javascript
// vite.config.js
import { defineConfig } from 'vite';
import stylexPlugin from '@stylexjs/vite-plugin';

export default defineConfig({
  plugins: [
    ...stylexPlugin({
      depsWithStyles: ['my-component-library'], // List dependencies with StyleX
      useCSSLayers: true,
    }),
  ],
});
```

And create a `src/stylex.css` file:
```css
/**
 * The @stylex directive is used by the @stylexjs/postcss-plugin.
 * It is automatically replaced with generated CSS during builds.
 */
@stylex;
```

Import this in your main entry file:
```javascript
// src/main.js
import './stylex.css';
// ... rest of your app
```

## Running the Example

```bash
npm install
npm run dev
```

## How It Works

The plugin configures Vite to use the StyleX team's recommended approach:

1. **Babel Plugin**: Uses `@vitejs/plugin-react` with `@stylexjs/babel-plugin` for transformation
2. **PostCSS Plugin**: Uses `@stylexjs/postcss-plugin` for CSS generation and dependency handling  
3. **Dependency Configuration**: Excludes StyleX dependencies from pre-bundling via `optimizeDeps.exclude`
4. **SSR Support**: Configures `ssr.noExternal` for proper server-side rendering

## Key Benefits

- ✅ Uses the StyleX team's recommended postcss + babel approach
- ✅ Works with published dependencies containing StyleX styles
- ✅ Proper dependency optimization for StyleX packages  
- ✅ Simplified configuration compared to manual setup
- ✅ Compatible with all StyleX features including CSS layers
