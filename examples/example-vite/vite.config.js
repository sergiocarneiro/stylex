/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { defineConfig } from "vite";
import stylexPlugin from "@stylexjs/vite-plugin";

// For this example, dependency-styles.js simulates a published dependency
// In a real app, this would be actual package names like:
// const depsWithStyles = ['my-component-library', '@company/design-system'];
const depsWithStyles = [];

export default defineConfig({
  plugins: [
    ...stylexPlugin({
      depsWithStyles,
      useCSSLayers: true,
    }),
  ],
});
