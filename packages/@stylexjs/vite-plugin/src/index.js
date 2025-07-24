/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow strict
 */

import { createRequire } from 'module';
import type { Plugin } from 'vite';

/**
 * StyleX plugin for Vite
 *
 * This plugin configures Vite to properly handle StyleX styles using the
 * recommended postcss + babel approach. It ensures that StyleX styles in
 * dependencies (node_modules) are properly compiled.
 */
export default function stylexVitePlugin(options?: {
  /** Array of dependency package names that contain StyleX styles */
  depsWithStyles?: string[],
  /** Babel configuration for StyleX transformation */
  babelConfig?: Object,
  /** Whether to use CSS layers for handling specificity */
  useCSSLayers?: boolean,
  /** Array of import sources to watch for StyleX usage */
  importSources?: Array<string | { from: string, as: string }>,
  /** Additional include patterns for PostCSS plugin */
  include?: string[],
  /** Exclude patterns for PostCSS plugin */
  exclude?: string[],
} = {}): Plugin[] {
  const {
    depsWithStyles = [],
    useCSSLayers = false,
    importSources = ['@stylexjs/stylex', 'stylex'],
    include = [],
    exclude = [],
    babelConfig: userBabelConfig = {},
  } = options;

  // Default babel configuration for StyleX
  const babelConfig = {
    babelrc: false,
    configFile: false,
    presets: ["@babel/preset-typescript"],
    plugins: [
      [
        "@stylexjs/babel-plugin",
        {
          dev: process.env.NODE_ENV === "development",
          test: process.env.NODE_ENV === "test",
          runtimeInjection: false,
          genConditionalClasses: true,
          treeshakeCompensation: true,
          unstable_moduleResolution: {
            type: "commonJS",
          },
          ...userBabelConfig,
        },
      ],
    ],
  };

  // Create require function that works in both CJS and ESM
  const requireFn = typeof require !== 'undefined' ? require : createRequire(import.meta.url);

  return [
    // Configure React plugin with Babel
    {
      ...requireFn('@vitejs/plugin-react').default({ babel: babelConfig }),
      name: 'vite-plugin-stylex-react',
    },

    // Configuration plugin to set up Vite properly for StyleX
    {
      name: 'vite-plugin-stylex-config',
      config(config) {
        // Set up CSS processing with PostCSS plugin
        config.css = config.css || {};
        config.css.postcss = config.css.postcss || {};
        config.css.postcss.plugins = config.css.postcss.plugins || [];

        // Add StyleX PostCSS plugin
        const stylexPostCSSPlugin = requireFn('@stylexjs/postcss-plugin')({
          babelConfig,
          useCSSLayers,
          importSources,
          include: [
            "./src/**/*.{js,jsx,ts,tsx}",
            ...include,
            // Include dependency paths
            ...depsWithStyles.map(
              (dep) => `./node_modules/${dep}/**/*.{js,jsx,ts,tsx}`
            ),
          ],
          exclude,
        });

        config.css.postcss.plugins.push(stylexPostCSSPlugin);

        // Add autoprefixer if not already present
        const hasAutoprefixer = config.css.postcss.plugins.some(
          plugin => plugin === 'autoprefixer' || (plugin && plugin.postcssPlugin === 'autoprefixer')
        );
        
        if (!hasAutoprefixer) {
          try {
            const autoprefixer = requireFn('autoprefixer');
            config.css.postcss.plugins.push(autoprefixer());
          } catch (error) {
            // Autoprefixer is optional, continue without it
          }
        }

        // Configure dependency optimization
        config.optimizeDeps = config.optimizeDeps || {};
        config.optimizeDeps.exclude = config.optimizeDeps.exclude || [];
        
        // Exclude StyleX dependencies from pre-bundling
        for (const dep of depsWithStyles) {
          if (!config.optimizeDeps.exclude.includes(dep)) {
            config.optimizeDeps.exclude.push(dep);
          }
        }

        // Configure SSR
        config.ssr = config.ssr || {};
        config.ssr.noExternal = config.ssr.noExternal || [];
        
        // Ensure dependencies with StyleX are processed during SSR
        for (const dep of depsWithStyles) {
          if (!config.ssr.noExternal.includes(dep)) {
            config.ssr.noExternal.push(dep);
          }
        }

        return config;
      },
    },
  ];
}
