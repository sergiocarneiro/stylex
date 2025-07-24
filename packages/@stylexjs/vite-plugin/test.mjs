"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = stylexVitePlugin;
var _rollupPlugin = _interopRequireDefault(require("@stylexjs/rollup-plugin"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 */

/**
 * StyleX plugin for Vite
 *
 * This plugin ensures that StyleX styles in dependencies (node_modules)
 * are properly compiled, addressing the issue where Vite doesn't transform
 * dependencies by default.
 */
function stylexVitePlugin(options = {}) {
  const rollupPlugin = (0, _rollupPlugin.default)(options);
  return {
    ...rollupPlugin,
    name: 'vite-plugin-stylex',
    // Ensure dependencies containing StyleX are optimized
    config(config) {
      config.optimizeDeps = config.optimizeDeps || {};
      config.optimizeDeps.include = config.optimizeDeps.include || [];

      // Add common StyleX-related packages to optimization
      const stylexPackages = ['@stylexjs/stylex', 'stylex'];
      for (const pkg of stylexPackages) {
        if (!config.optimizeDeps.include.includes(pkg)) {
          config.optimizeDeps.include.push(pkg);
        }
      }

      // Ensure CSS processing is enabled
      config.css = config.css || {};
      return config;
    },
    // Handle dependency pre-bundling for StyleX
    configResolved(resolvedConfig) {
      // In development, we need to ensure dependencies with StyleX are included
      if (resolvedConfig.command === 'serve') {
        resolvedConfig.optimizeDeps = resolvedConfig.optimizeDeps || {};
        resolvedConfig.optimizeDeps.force = true;
      }
    },
    // Override shouldTransformCachedModule to handle Vite-specific caching
    shouldTransformCachedModule(context) {
      var _rollupPlugin$shouldT;
      // Always re-transform if the file contains StyleX imports
      if (context.code) {
        const importSources = options.importSources ? Array.isArray(options.importSources) ? options.importSources : [options.importSources] : ['@stylexjs/stylex', 'stylex'];
        const hasStyleXImports = importSources.some(importName => typeof importName === 'string' ? context.code.includes(importName) : context.code.includes(importName.from));
        if (hasStyleXImports) {
          return true;
        }
      }

      // Fall back to the rollup plugin's behavior
      return ((_rollupPlugin$shouldT = rollupPlugin.shouldTransformCachedModule) === null || _rollupPlugin$shouldT === void 0 ? void 0 : _rollupPlugin$shouldT.call(rollupPlugin, context)) ?? false;
    }
  };
}
