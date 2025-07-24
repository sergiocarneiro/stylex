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

Add the plugin to your `vite.config.js`:

```javascript
import { defineConfig } from 'vite';
import stylexPlugin from '@stylexjs/vite-plugin';

export default defineConfig({
  plugins: [
    stylexPlugin({
      fileName: 'stylex.css',
      // ... other StyleX options
    }),
  ],
});
```

## Problem Solved

This plugin specifically addresses the issue where StyleX styles in published dependencies (npm packages in `node_modules`) are not compiled when using Vite. 

**The Problem:**
- Vite by default doesn't transform files in `node_modules`
- Workspace dependencies work fine (Vite treats them as source code)
- Published dependencies containing `stylex.create()` calls cause runtime errors

**The Solution:**
This plugin extends `@stylexjs/rollup-plugin` with Vite-specific optimizations:
- Ensures StyleX dependencies are included in Vite's dependency optimization
- Forces re-transformation of cached modules containing StyleX code
- Handles Vite's dependency pre-bundling correctly

## Plugin Options

This plugin inherits all options from `@stylexjs/rollup-plugin`. See the [configuration documentation](https://stylexjs.com/docs/api/configuration/babel-plugin/) for all available options.

### fileName
```js
fileName: string // Default: 'stylex.css'
```
The name of the output CSS file.

### useCSSLayers
```js
useCSSLayers: boolean // Default: false
```
Enabling this option switches StyleX from using `:not(#\#)` to using `@layers` for handling CSS specificity.

## Comparison with Rollup Plugin

While you can use `@stylexjs/rollup-plugin` directly with Vite, this dedicated Vite plugin provides:
- Better integration with Vite's dependency optimization
- Proper handling of Vite's module caching
- Vite-specific development server optimizations

## Migration from Rollup Plugin

If you're currently using `@stylexjs/rollup-plugin` with Vite:

```javascript
// Before
import stylexPlugin from '@stylexjs/rollup-plugin';

// After  
import stylexPlugin from '@stylexjs/vite-plugin';

// Configuration remains the same
export default defineConfig({
  plugins: [stylexPlugin({ fileName: 'stylex.css' })],
});
```