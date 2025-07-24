# @stylexjs/vite-plugin

## Documentation Website
[https://stylexjs.com](https://stylexjs.com)

## Installation

Install the package by using:
```bash
npm install --save-dev @stylexjs/vite-plugin
```

or with yarn:

```
yarn add --dev @stylexjs/vite-plugin
```

## Usage

Add the plugin to your `vite.config.js` and create a `stylex.css` file:

```javascript
// vite.config.js
import { defineConfig } from 'vite';
import stylexPlugin from '@stylexjs/vite-plugin';

export default defineConfig({
  plugins: [
    ...stylexPlugin({
      // Optional: specify dependencies that contain StyleX styles
      depsWithStyles: ['my-component-library', '@company/design-system'],
      // Optional: enable CSS layers
      useCSSLayers: true,
    }),
  ],
});
```

Create a `src/stylex.css` file:
```css
/**
 * The @stylex directive is used by the @stylexjs/postcss-plugin.
 * It is automatically replaced with generated CSS during builds.
 */
@stylex;
```

Import this file from your application entrypoint:
```javascript
// src/main.js or src/index.js
import './stylex.css';
// ... rest of your app
```

## Problem Solved

This plugin specifically addresses the issue where StyleX styles in published dependencies (npm packages in `node_modules`) are not compiled when using Vite. 

**The Problem:**
- Vite by default doesn't transform files in `node_modules`
- Workspace dependencies work fine (Vite treats them as source code)
- Published dependencies containing `stylex.create()` calls cause runtime errors

**The Solution:**
This plugin uses the recommended postcss + babel approach:
- Configures `@vitejs/plugin-react` with StyleX babel plugin for transformation
- Sets up `@stylexjs/postcss-plugin` for CSS generation and dependency handling
- Configures Vite's `optimizeDeps.exclude` and `ssr.noExternal` for dependencies
- Automatically includes dependency paths in PostCSS processing

## Plugin Options

### depsWithStyles
```js
depsWithStyles: string[] // Default: []
```
Array of dependency package names that contain StyleX styles. These will be excluded from Vite's dependency optimization and included in StyleX processing.

### useCSSLayers
```js
useCSSLayers: boolean // Default: false
```
Enabling this option switches StyleX from using `:not(#\#)` to using `@layers` for handling CSS specificity.

### babelConfig
```js
babelConfig: object // Default: {}
```
Additional babel configuration options that will be merged with the default StyleX babel configuration.

### importSources
```js
importSources: Array<string | { from: string, as: string }> // Default: ['@stylexjs/stylex', 'stylex']
```
Possible strings where you can import stylex from. Files that do not match the import sources may be skipped from being processed to speed up compilation.

### include
```js
include: string[] // Default: []
```
Additional file patterns to include in StyleX processing beyond the default `./src/**/*.{js,jsx,ts,tsx}`.

### exclude
```js
exclude: string[] // Default: []
```
File patterns to exclude from StyleX processing.

## Recommended Configuration

For projects with StyleX dependencies, use this configuration:

```javascript
// vite.config.js
import { defineConfig } from "vite";
import stylexPlugin from "@stylexjs/vite-plugin";

const depsWithStyles = [
  "my-component-library",
  "@company/design-system",
];

export default defineConfig({
  plugins: [
    ...stylexPlugin({
      depsWithStyles,
      useCSSLayers: true,
      babelConfig: {
        // Additional babel options if needed
      },
    }),
  ],
});
```

## How It Works

This plugin configures Vite to use the recommended StyleX approach:

1. **Babel Transformation**: Uses `@vitejs/plugin-react` with `@stylexjs/babel-plugin` to transform StyleX calls
2. **CSS Generation**: Configures `@stylexjs/postcss-plugin` to generate CSS from transformed StyleX
3. **Dependency Handling**: Excludes StyleX dependencies from pre-bundling so they're processed by the build pipeline
4. **File Processing**: Includes dependency files in PostCSS processing patterns

This approach is recommended by the StyleX team and provides better integration with Vite's build system compared to using rollup plugins.