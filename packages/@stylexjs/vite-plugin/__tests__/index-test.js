/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

import stylexVitePlugin from '../src/index';

describe('@stylexjs/vite-plugin', () => {
  it('should create a valid Vite plugin', () => {
    const plugin = stylexVitePlugin();

    expect(plugin).toBeTruthy();
    expect(plugin.name).toBe('vite-plugin-stylex');
    expect(typeof plugin.config).toBe('function');
    expect(typeof plugin.configResolved).toBe('function');
  });

  it('should configure optimizeDeps correctly', () => {
    const plugin = stylexVitePlugin();
    const config = {};

    const result = plugin.config(config);

    expect(result.optimizeDeps).toBeDefined();
    expect(result.optimizeDeps.include).toContain('@stylexjs/stylex');
    expect(result.optimizeDeps.include).toContain('stylex');
  });

  it('should handle existing optimizeDeps configuration', () => {
    const plugin = stylexVitePlugin();
    const config = {
      optimizeDeps: {
        include: ['existing-package'],
      },
    };

    const result = plugin.config(config);

    expect(result.optimizeDeps.include).toContain('existing-package');
    expect(result.optimizeDeps.include).toContain('@stylexjs/stylex');
    expect(result.optimizeDeps.include).toContain('stylex');
  });

  it('should detect StyleX imports in shouldTransformCachedModule', () => {
    const plugin = stylexVitePlugin();

    const contextWithStyleX = {
      code: "import stylex from '@stylexjs/stylex'; const styles = stylex.create({});",
      id: 'test.js',
      meta: { stylex: [] },
    };

    const contextWithoutStyleX = {
      code: "const foo = 'bar';",
      id: 'test.js',
      meta: {},
    };

    expect(plugin.shouldTransformCachedModule(contextWithStyleX)).toBe(true);
    expect(plugin.shouldTransformCachedModule(contextWithoutStyleX)).toBe(
      false,
    );
  });
});
