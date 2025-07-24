/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow strict
 */

import stylexRollupPlugin from '@stylexjs/rollup-plugin';
import type { Plugin } from 'vite';
import type { PluginOptions } from '@stylexjs/rollup-plugin';

/**
 * StyleX plugin for Vite
 *
 * This plugin ensures that StyleX styles in dependencies (node_modules)
 * are properly compiled, addressing the issue where Vite doesn't transform
 * dependencies by default.
 */
export default function stylexVitePlugin(options: PluginOptions = {}): Plugin {
  const rollupPlugin = stylexRollupPlugin(options);

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
      // Always re-transform if the file contains StyleX imports
      if (context.code) {
        const importSources = options.importSources
          ? Array.isArray(options.importSources)
            ? options.importSources
            : [options.importSources]
          : ['@stylexjs/stylex', 'stylex'];

        const hasStyleXImports = importSources.some((importName) =>
          typeof importName === 'string'
            ? context.code.includes(importName)
            : context.code.includes(importName.from),
        );

        if (hasStyleXImports) {
          return true;
        }
      }

      // Fall back to the rollup plugin's behavior
      return rollupPlugin.shouldTransformCachedModule?.(context) ?? false;
    },
  };
}
