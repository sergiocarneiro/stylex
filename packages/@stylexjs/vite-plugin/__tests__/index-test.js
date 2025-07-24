/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

import stylexVitePlugin from '../src/index';

// Mock dependencies
jest.mock('@vitejs/plugin-react', () => ({
  default: jest.fn(() => ({
    name: 'mock-react-plugin',
  })),
}));

jest.mock('@stylexjs/postcss-plugin', () => jest.fn(() => ({
  postcssPlugin: 'mock-postcss-plugin',
})));

jest.mock('autoprefixer', () => jest.fn(() => ({
  postcssPlugin: 'autoprefixer',
})));

describe('@stylexjs/vite-plugin', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return an array of plugins', () => {
    const plugins = stylexVitePlugin();

    expect(Array.isArray(plugins)).toBe(true);
    expect(plugins).toHaveLength(2);
    expect(plugins[0].name).toBe('vite-plugin-stylex-react');
    expect(plugins[1].name).toBe('vite-plugin-stylex-config');
  });

  it('should configure CSS with PostCSS plugins', () => {
    const plugins = stylexVitePlugin();
    const configPlugin = plugins.find(p => p.name === 'vite-plugin-stylex-config');
    const config = {};

    const result = configPlugin.config(config);

    expect(result.css).toBeDefined();
    expect(result.css.postcss).toBeDefined();
    expect(result.css.postcss.plugins).toBeDefined();
    expect(Array.isArray(result.css.postcss.plugins)).toBe(true);
  });

  it('should configure optimizeDeps.exclude for dependencies with styles', () => {
    const depsWithStyles = ['my-component-lib', '@company/design-system'];
    const plugins = stylexVitePlugin({ depsWithStyles });
    const configPlugin = plugins.find(p => p.name === 'vite-plugin-stylex-config');
    const config = {};

    const result = configPlugin.config(config);

    expect(result.optimizeDeps).toBeDefined();
    expect(result.optimizeDeps.exclude).toContain('my-component-lib');
    expect(result.optimizeDeps.exclude).toContain('@company/design-system');
  });

  it('should configure SSR noExternal for dependencies with styles', () => {
    const depsWithStyles = ['my-component-lib'];
    const plugins = stylexVitePlugin({ depsWithStyles });
    const configPlugin = plugins.find(p => p.name === 'vite-plugin-stylex-config');
    const config = {};

    const result = configPlugin.config(config);

    expect(result.ssr).toBeDefined();
    expect(result.ssr.noExternal).toContain('my-component-lib');
  });

  it('should preserve existing configuration', () => {
    const plugins = stylexVitePlugin({ depsWithStyles: ['new-dep'] });
    const configPlugin = plugins.find(p => p.name === 'vite-plugin-stylex-config');
    const config = {
      optimizeDeps: {
        exclude: ['existing-dep'],
      },
      ssr: {
        noExternal: ['existing-ssr-dep'],
      },
      css: {
        postcss: {
          plugins: ['existing-plugin'],
        },
      },
    };

    const result = configPlugin.config(config);

    expect(result.optimizeDeps.exclude).toContain('existing-dep');
    expect(result.optimizeDeps.exclude).toContain('new-dep');
    expect(result.ssr.noExternal).toContain('existing-ssr-dep');
    expect(result.ssr.noExternal).toContain('new-dep');
    expect(result.css.postcss.plugins).toContain('existing-plugin');
  });

  it('should merge babel configuration', () => {
    const userBabelConfig = {
      customOption: true,
    };
    const plugins = stylexVitePlugin({ babelConfig: userBabelConfig });

    // Verify that the React plugin is called with merged config
    const mockReactPlugin = require('@vitejs/plugin-react').default;
    expect(mockReactPlugin).toHaveBeenCalledWith({
      babel: expect.objectContaining({
        babelrc: false,
        configFile: false,
        presets: ["@babel/preset-typescript"],
        plugins: [
          [
            "@stylexjs/babel-plugin",
            expect.objectContaining({
              customOption: true,
            }),
          ],
        ],
      }),
    });
  });

  it('should include dependency paths in PostCSS configuration', () => {
    const depsWithStyles = ['dep1', 'dep2'];
    const plugins = stylexVitePlugin({ depsWithStyles });
    const configPlugin = plugins.find(p => p.name === 'vite-plugin-stylex-config');
    const config = {};

    configPlugin.config(config);

    const mockPostCSSPlugin = require('@stylexjs/postcss-plugin');
    expect(mockPostCSSPlugin).toHaveBeenCalledWith(
      expect.objectContaining({
        include: expect.arrayContaining([
          "./src/**/*.{js,jsx,ts,tsx}",
          "./node_modules/dep1/**/*.{js,jsx,ts,tsx}",
          "./node_modules/dep2/**/*.{js,jsx,ts,tsx}",
        ]),
      })
    );
  });
});
