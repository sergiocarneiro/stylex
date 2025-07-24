/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
module.exports = {
  testEnvironment: 'node',
  displayName: 'vite-plugin',
  testMatch: ['**/__tests__/**/*-test.js'],
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/**/__tests__/**/*',
    '!src/**/__benchmarks__/**/*',
  ],
};
