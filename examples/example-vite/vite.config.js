/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import autoprefixer from "autoprefixer";
import stylex from "@stylexjs/postcss-plugin";

// For this example, dependency-styles.js simulates a published dependency
// In a real app, this would be actual package names like:
// const depsWithStyles = ['my-component-library', '@company/design-system'];
const depsWithStyles = [];

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
      },
    ],
  ],
};

export default defineConfig({
  plugins: [
    react({ babel: babelConfig }),
  ],
  css: {
    postcss: {
      plugins: [
        stylex({
          babelConfig,
          useCSSLayers: true,
          include: [
            "./src/**/*.{js,jsx,ts,tsx}",
            // Include dependency paths when needed
            ...depsWithStyles.map(
              (dep) => `./node_modules/${dep}/build/**/*.{js,jsx,ts,tsx}`
            ),
          ],
        }),
        autoprefixer(),
      ],
    },
  },
  // Prevent dependencies that contain StyleX styles from being pre-bundled
  optimizeDeps: {
    exclude: depsWithStyles,
  },
  ssr: {
    noExternal: depsWithStyles,
  },
});
